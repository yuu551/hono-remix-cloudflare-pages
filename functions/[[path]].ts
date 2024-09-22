import handle from "hono-remix-adapter/cloudflare-pages";
import * as build from "../build/server";
import hono from "../server";
export const onRequest = handle(build, hono);
