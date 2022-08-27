/// <reference lib="webworker" />
import type { worker } from "monaco-editor";

import { initialize } from "./worker-init";
import ts from "typescript";

import { format } from "../tasks/format";
import { createFile } from "../tasks/create-file";
import { getShareURL } from "../tasks/get-share-url";
import { build } from "../tasks/build";

export class TaskRunner {
  // --- model sync -----------------------
  private _ctx: worker.IWorkerContext;
  private _extraLibs: IExtraLibs = Object.create(null);
  private _compilerOptions: ts.CompilerOptions;
  private _inlayHintsOptions?: InlayHintsOptions;

  constructor(ctx: worker.IWorkerContext, createData: ICreateData = {}) {
    this._ctx = ctx;
    this._compilerOptions = createData.compilerOptions;
    this._extraLibs = createData.extraLibs;
    this._inlayHintsOptions = createData.inlayHintsOptions;
  }

  public format = format;
  public createFile = createFile;
  public getShareURL = getShareURL;
  public build = build;
};

export const connect = (port: MessagePort | typeof globalThis) => {
  let initialized = false;
  port.onmessage = (e) => {
    initialize(function (ctx: worker.IWorkerContext, createData: ICreateData) {
      return new TaskRunner(ctx, createData);
    }, port, initialized);
  };
}

(self as unknown as SharedWorkerGlobalScope).onconnect = (e) => {
  let [port] = e.ports;
  connect(port)
}

if (!("SharedWorkerGlobalScope" in self)) {
  connect(self);
}

export default TaskRunner;

export interface IExtraLibs {
  [path: string]: {
    content: string;
    version: number;
  };
}

interface InlayHintsOptions {
  readonly includeInlayParameterNameHints?: 'none' | 'literals' | 'all';
  readonly includeInlayParameterNameHintsWhenArgumentMatchesName?: boolean;
  readonly includeInlayFunctionParameterTypeHints?: boolean;
  readonly includeInlayVariableTypeHints?: boolean;
  readonly includeInlayPropertyDeclarationTypeHints?: boolean;
  readonly includeInlayFunctionLikeReturnTypeHints?: boolean;
  readonly includeInlayEnumMemberValueHints?: boolean;
}

export interface ICreateData {
  compilerOptions?: ts.CompilerOptions;
  extraLibs?: IExtraLibs;
  customWorkerPath?: string;
  inlayHintsOptions?: InlayHintsOptions;
}

