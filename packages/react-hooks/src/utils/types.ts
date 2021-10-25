type Primitive =
  | bigint
  | boolean
  | null
  | number
  | string
  | symbol
  | undefined;

type JSONObject = {
  [key in string | number]: JSONValue;
};

interface JSONArray extends Array<JSONValue> { }

type JSONValue = Primitive | JSONObject | JSONArray;