"""Exercise public team boundaries with fake storage and no external services."""
import ast
import pathlib
import types
import unittest
import uuid
from datetime import datetime, timezone
from unittest.mock import AsyncMock

class HTTPException(Exception):
    def __init__(self, status_code, detail):
        self.status_code = status_code

def load_routes(db):
    path = pathlib.Path(__file__).parents[1] / 'frontend/api/index.py'
    tree = ast.parse(path.read_text(encoding='utf-8'))
    selected = []
    for node in tree.body:
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)) and node.name in {'public_team', 'save_or_update_team', 'get_team'}:
            node.decorator_list = []
            for arg in node.args.args:
                arg.annotation = None
            selected.append(node)
    namespace = dict(db=db, HTTPException=HTTPException, uuid=uuid, datetime=datetime, timezone=timezone,
                     slugify=lambda value: 'example', pytz=types.SimpleNamespace(all_timezones_set={'Europe/London'}))
    exec(compile(ast.fix_missing_locations(ast.Module(body=selected, type_ignores=[])), str(path), 'exec'), namespace)
    return namespace

def request(**overrides):
    member = types.SimpleNamespace(name='Designer', city='London', timezone_id='Europe/London')
    member.dict = lambda: {'name':'Designer', 'city':'London', 'timezone_id':'Europe/London', 'utc_offset':'+01:00'}
    values = dict(name='Example', members=[member], custom_slug=None, is_paid=False, email='never-stored@example.invalid', opt_in=True)
    values.update(overrides)
    return types.SimpleNamespace(**values)

class PublicTeams(unittest.IsolatedAsyncioTestCase):
    async def test_cannot_claim_paid_or_overwrite_a_slug(self):
        routes = load_routes(None)
        for fields in ({'is_paid':True}, {'custom_slug':'existing-team'}):
            with self.assertRaises(HTTPException) as error:
                await routes['save_or_update_team'](None, request(**fields))
            self.assertEqual(error.exception.status_code, 403)

    async def test_limits_and_invalid_zone_rejected_before_storage(self):
        routes = load_routes(None)
        for req in [request(members=[]), request(members=request().members * 7), request(name='x'*101)]:
            with self.assertRaises(HTTPException) as error:
                await routes['save_or_update_team'](None, req)
            self.assertEqual(error.exception.status_code, 422)
        req = request()
        req.members[0].timezone_id = 'Invalid/Zone'
        with self.assertRaises(HTTPException) as error:
            await routes['save_or_update_team'](None, req)
        self.assertEqual(error.exception.status_code, 422)

    async def test_creates_new_public_record_without_contact_information(self):
        db = types.SimpleNamespace(teams=types.SimpleNamespace(insert_one=AsyncMock()))
        routes = load_routes(db)
        first = await routes['save_or_update_team'](None, request())
        second = await routes['save_or_update_team'](None, request())
        self.assertNotEqual(first['slug'], second['slug'])
        stored = db.teams.insert_one.call_args.args[0]
        self.assertNotIn('email', stored)
        self.assertNotIn('opt_in', stored)
        self.assertFalse(stored['is_paid'])

    async def test_legacy_public_read_excludes_private_fields(self):
        legacy = dict(slug='old', name='Example', email='private@example.invalid', opt_in=True, members=[{'name':'Designer', 'email':'private@example.invalid'}])
        db = types.SimpleNamespace(teams=types.SimpleNamespace(find_one=AsyncMock(return_value=legacy)))
        result = await load_routes(db)['get_team']('old')
        self.assertNotIn('email', result)
        self.assertNotIn('opt_in', result)
        self.assertNotIn('email', result['members'][0])

    async def test_storage_outage_does_not_claim_success(self):
        with self.assertRaises(HTTPException) as error:
            await load_routes(None)['save_or_update_team'](None, request())
        self.assertEqual(error.exception.status_code, 503)

if __name__ == '__main__':
    unittest.main()
