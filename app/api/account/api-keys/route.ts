import { NextResponse } from "next/server";
import { readBillingIdentity } from "@/lib/billing-auth";
import { getUserApiKeys, maskKey, saveUserApiKeys, type UserProviderKeys } from "@/lib/user-api-keys";

type ApiKeyStatus = {
  present: boolean;
  preview: string;
};

type ApiKeyStatusResponse = Record<keyof UserProviderKeys, ApiKeyStatus>;

const emptyStatus: ApiKeyStatus = { present: false, preview: "" };

function toStatus(keys: UserProviderKeys | null): ApiKeyStatusResponse {
  const source = keys || {};

  return {
    replicateApiToken: source.replicateApiToken
      ? { present: true, preview: maskKey(source.replicateApiToken) }
      : emptyStatus,
    huggingfaceApiKey: source.huggingfaceApiKey
      ? { present: true, preview: maskKey(source.huggingfaceApiKey) }
      : emptyStatus,
    openaiApiKey: source.openaiApiKey
      ? { present: true, preview: maskKey(source.openaiApiKey) }
      : emptyStatus,
    elevenlabsApiKey: source.elevenlabsApiKey
      ? { present: true, preview: maskKey(source.elevenlabsApiKey) }
      : emptyStatus,
    voicerssApiKey: source.voicerssApiKey
      ? { present: true, preview: maskKey(source.voicerssApiKey) }
      : emptyStatus,
    googleTtsKey: source.googleTtsKey
      ? { present: true, preview: maskKey(source.googleTtsKey) }
      : emptyStatus,
  };
}

export async function GET(request: Request) {
  const identity = readBillingIdentity(request);
  if (!identity.userId) {
    return NextResponse.json({ error: "Billing account not provisioned" }, { status: 401 });
  }

  const keys = await getUserApiKeys(identity.userId);
  return NextResponse.json({ ok: true, keys: toStatus(keys) });
}

export async function POST(request: Request) {
  const identity = readBillingIdentity(request);
  if (!identity.userId) {
    return NextResponse.json({ error: "Billing account not provisioned" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const payload = (body?.keys || {}) as UserProviderKeys;
  const updated = await saveUserApiKeys(identity.userId, payload);

  return NextResponse.json({ ok: true, keys: toStatus(updated) });
}
