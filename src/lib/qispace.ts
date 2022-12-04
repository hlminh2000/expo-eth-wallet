import * as SecureStore from "expo-secure-store";
import { arrayify } from "@ethersproject/bytes";

const deviceToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfaWQiOjUxNjEsImRldmljZV9pZCI6NTE2MSwidG9rZW5faWQiOjMwMzQsImlhdCI6MTY3MDExNDcyMH0.zs8sBx47eFLwM2ivllacW6GJTCeUJPAXzqDvClYtSjg";

const API_HOST = "https://enterprise.staging.qispace.info";
const QISPACE_SUBKEY = "QISPACE_SUBKEY";

const subscribe = async () => {
  const resp = await fetch(`${API_HOST}/kds/api/v1/sub_key`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${deviceToken}`,
    },
    body: JSON.stringify({}),
  });
  if (resp.status !== 200) throw "could not subscribe to QiSpace Enterprise";

  const { sub_key } = (await resp.json()) as {
    sub_key: string;
    key_index: string;
  };

  await SecureStore.setItemAsync(QISPACE_SUBKEY, sub_key);
  return sub_key;
};

const getSubkey = () =>
  SecureStore.getItemAsync(QISPACE_SUBKEY).catch(() => null);

const getQe = async (byteSize = 16) => {
  const resp = await fetch(`${API_HOST}/kds/api/v1/qe/${byteSize}`, {
    headers: { Authorization: `Bearer ${deviceToken}` },
  });
  if (resp.status !== 200) throw "could not retrieve QE";

  const qe = (await resp.json()) as {
    success: string;
    size: number;
    iv: string;
    payload: string;
  };

  return qe;
};

export const stringToUint8Array = (str: string) => arrayify(Buffer.from(str));

export const qispaceClient = {
  subscribe,
  getSubkey,
  getQe,
  stringToUint8Array,
};
