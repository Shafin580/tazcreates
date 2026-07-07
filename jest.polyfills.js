// Web APIs that jsdom lacks — required for msw@2 (and any fetch-based test code).
const { TextEncoder, TextDecoder } = require("util");
const { ReadableStream, TransformStream } = require("stream/web");
const { Blob, File } = require("buffer");
const { MessageChannel, MessagePort } = require("worker_threads");

if (typeof globalThis.TextEncoder === "undefined") globalThis.TextEncoder = TextEncoder;
if (typeof globalThis.TextDecoder === "undefined") globalThis.TextDecoder = TextDecoder;
if (typeof globalThis.ReadableStream === "undefined") globalThis.ReadableStream = ReadableStream;
if (typeof globalThis.TransformStream === "undefined") globalThis.TransformStream = TransformStream;
if (typeof globalThis.Blob === "undefined") globalThis.Blob = Blob;
if (typeof globalThis.File === "undefined") globalThis.File = File;
if (typeof globalThis.MessageChannel === "undefined") globalThis.MessageChannel = MessageChannel;
if (typeof globalThis.MessagePort === "undefined") globalThis.MessagePort = MessagePort;

const { fetch, Headers, FormData, Request, Response } = require("undici");

// Force-override jsdom's broken/missing versions.
globalThis.fetch = fetch;
globalThis.Headers = Headers;
globalThis.FormData = FormData;
globalThis.Request = Request;
globalThis.Response = Response;
