import sys
sys.path.append("d:/AI_Stuff/Gravity/GlobalSync-AI/frontend")
from api.index import get_timezone, CITY_TIMEZONES

cities = ["San Francisco", "New York", "London", "Tokyo", "san francisco", "San francisco"]
for c in cities:
    res = get_timezone(c)
    print(f"City: {c} -> Timezone: {res}")
