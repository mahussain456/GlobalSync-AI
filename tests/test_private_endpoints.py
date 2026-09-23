"""Exercise retired public endpoints without connecting to a production database."""
import ast
import pathlib
import unittest

class HTTPException(Exception):
    def __init__(self, status_code, detail):
        self.status_code = status_code

class PrivateEndpoints(unittest.IsolatedAsyncioTestCase):
    async def test_public_data_endpoints_fail_closed(self):
        source = pathlib.Path(__file__).parents[1] / 'frontend/api/index.py'
        tree = ast.parse(source.read_text(encoding='utf-8'))
        expected = {'save_history_item':410, 'get_history_items':410, 'clear_history':410, 'get_all_users':403, 'get_user_teams':403}
        for name, status in expected.items():
            node = next(n for n in tree.body if isinstance(n, ast.AsyncFunctionDef) and n.name == name)
            node.decorator_list = []
            for arg in node.args.args: arg.annotation = None
            namespace = {'HTTPException':HTTPException}
            exec(compile(ast.fix_missing_locations(ast.Module(body=[node], type_ignores=[])), str(source), 'exec'), namespace)
            with self.assertRaises(HTTPException) as caught:
                await namespace[name](*([None] if node.args.args else []))
            self.assertEqual(caught.exception.status_code, status)

if __name__ == '__main__': unittest.main()
