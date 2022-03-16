import { jest } from "@jest/globals";
import { Readable, Writable } from "stream";
import { handler } from "../../../server/routes";

export default class TestUtil {
  static generateReadbleStream(data) {
    return new Readable({
      read() {
        for (const item of data) {
          this.push(item);
        }
        this.push(null);
      },
    });
  }
  static generateWritableStream(onData) {
    return new Writable({
      write(chunck, enc, cb) {
        onData(chunck);
        cb(null, chunck);
      },
    });
  }

  static defaultHandleParams() {
    const requestStream = TestUtil.generateReadbleStream([
      "body da requisição",
    ]);
    const response = TestUtil.generateWritableStream(() => {});
    const data = {
      request: Object.assign(requestStream, {
        headers: {},
        method: "",
        url: "",
      }),
      response: Object.assign(response, {
        writeHead: jest.fn(),
        end: jest.fn(),
      }),
    };
    return {
      values: () => Object.values(data),
      ...data,
    };
  }
}
