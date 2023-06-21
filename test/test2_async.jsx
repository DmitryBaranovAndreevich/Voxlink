// v1.3
"use strict";

class Deferred extends Promise {
  constructor(executor) {
    let res;
    let rej;
    super((resolve, reject) => {
      res = resolve;
      rej = reject;
      if (typeof executor === "function") {
        return executor(resolve, reject);
      }
    });
    this.resolve = (res || (() => {})).bind(this);
    this.reject = (rej || (() => {})).bind(this);
  }
}

makeGlobalPromiseWithDefaultTimeout.call(this);

const assert = require("assert").strict;

/** @returns {Promise<'1'>} */
const sleep100 = makeSleep("1", 100);
/** @returns {Promise<'2'>} */
const sleep200 = makeSleep("2", 200);
/** @returns {Promise<'5'>} */
const sleep500 = makeSleep("5", 500);

{
  // TEST 2.1
  // todo: Вызовите по очереди методы sleep500 -> sleep200 -> sleep100, дожидаясь выполнения каждого перед запуском следующего метода.
  //  Обратите внимание, что sleepOneByOneAsyncAwaited должна, в результате, составить строковое значение.
  //  !!! Для решения применить async/await-подход !!!
  async function sleepOneByOneAsyncAwaited() {
    const first = await sleep500();
    const second = await sleep200();
    const third = await sleep100();

    return String(first) + String(second) + String(third);
  }

  const start = Date.now();

  sleepOneByOneAsyncAwaited().then((orderString) => {
    const timeSpent = Date.now() - start;

    assert.equal(timeSpent >= 800, true, "Test failed. Too fast");
    assert.equal(orderString, "521", "Test failed. Wrong order");
  });
}

{
  // TEST 2.2
  // todo: Вызовите по очереди методы sleep500 -> sleep200 -> sleep100, дожидаясь выполнения каждого перед запуском следующего метода.
  //  Обратите внимание, что sleepOneByOnePromised должна, в результате, составить строковое значение.
  //  !!! Для решения применить Promise-подход (т.е. без async/await) !!!
  function sleepOneByOnePromised() {
    let result = "";
    return sleep500()
      .then((res) => {
        result += res;
        return sleep200();
      })
      .then((res) => {
        result += res;
        return sleep100();
      })
      .then((res) => {
        result += res;
        return result;
      });
  }

  const start = Date.now();

  sleepOneByOnePromised().then((orderString) => {
    const timeSpent = Date.now() - start;

    assert.equal(timeSpent >= 800, true, "Test failed. Too fast");
    assert.equal(orderString, "521", "Test failed. Wrong order");
  });
}

{
  // TEST 2.3
  // Строку ниже нельзя изменять
  const orderedSleeps = [
    sleep500,
    sleep200,
    sleep100,
    sleep500,
    sleep200,
    sleep100,
    sleep500,
    sleep200,
    sleep100,
  ];

  // todo: Воспользовавшись циклом, переберите массив orderedSleeps таким образом, чтобы каждый метод дожидался
  //  завершения выполнения предыдущего (первый метод ничего дожидаться не должен) и полученное значение конкатенировал
  //  с полученным значением от предыдущего промиса (в итоге нужно собрать строку из кол-ва символов == orderedSleeps.length).
  //  Функция sleepOneByOne() завершается, когда выполнился самый последний метод в orderedSleeps.
  // !!! sleepOneByOne() не должна иметь модификатор async и должна возвращать инстанс класса Promise !!!
  function sleepOneByOne() {
    return orderedSleeps.reduce((priv, el) => {
      return priv.then((res) => {
        return el().then((res2) => Promise.resolve(res + res2));
      });
    }, Promise.resolve(""));
  }

  sleepOneByOne().then((orderString) => {
    assert.equal(orderString, "521521521", "Test failed. Wrong order");
  });
}

{
  // TEST 2.4
  // todo: Вызовите методы sleep100, sleep200 и sleep500, дождавшись выполнения каждого,
  //  но так, чтобы методы не дожидались выполнения друг друга
  async function sleepParallel() {
    let count = 0;
    let result = "";
    return new Promise((resolve, reject) => {
      function callback(res) {
        count++;
        result += res;
        if (count === 3) {
          return resolve(result);
        }
      }
      sleep100().then(callback);
      sleep200().then(callback);
      sleep500().then(callback);
    });
  }

  const start = Date.now();

  sleepParallel().then((orderString) => {
    const timeSpent = Date.now() - start;

    assert.equal(timeSpent <= 800, true, "Test failed. Too slow");
    assert.equal(
      typeof orderString,
      "string",
      "Test failed. Result should be string"
    );
    assert.equal(orderString.length, 3, "Test failed. Not all methods done");
  });
}

/**
 * @typedef {Deferred} CancelableDeferred
 * @property {(err?: Error) => CancelableDeferred} cancel
 */

{
  // TEST 2.5
  let asyncFunctionExecutedTooLong_called = false;
  let deferredCancel_called = false;

  /** @returns {CancelableDeferred} */
  function asyncFunctionExecutedTooLong() {
    // Нельзя изменять содержимое этой функции.
    /** @type {ReturnType<setTimeout>} */
    let timer;
    /** @type {CancelableDeferred} */
    const deferred = new Deferred((resolve) => {
      asyncFunctionExecutedTooLong_called = true;

      timer = setTimeout(resolve, 0x240_c_840_0);
    });

    deferred.cancel = function (err) {
      deferredCancel_called = true;

      if (timer) {
        clearTimeout(timer);
        timer = void 0;
      }

      deferred.reject(err);

      return /** @type {CancelableDeferred} */ deferred;
    };

    return deferred;
  }

  // todo: Предположим, что функция asyncFunctionExecutedTooLong может выполняться очень долго, но нам нужно всё
  //  равно её выполниться. Нужно написать код, который вызовет функцию asyncFunctionExecutedTooLong и:
  //   - либо дождётся выполнения асинхронной функции asyncFunctionExecutedTooLong
  //   - либо завершится с ошибкой 'Timeout' через 2 секунды после начала работы
  //  Если execWithTimeout завершается с ошибкой 'Timeout', то не забыть вызвать `cancel` у Deferred-объекта, который
  //   возвращает функция asyncFunctionExecutedTooLong
  function execWithTimeout() {
    // Deferred is Promise-like object
    const promiseLike = asyncFunctionExecutedTooLong();
    const DEFAULT_TIMEOUT = 2000;
    let timer;
    return new Promise((resolve, reject) => {
      timer = setTimeout(() => {
        reject(new Error("Timeout"));
        promiseLike.cancel();
      }, DEFAULT_TIMEOUT);
      promiseLike
        .then((res) => resolve(res))
        .catch((err) => err)
        .finally(() => {
          clearTimeout(timer);
        });
    });
  }

  let errMessage;

  execWithTimeout()
    .catch((err) => {
      errMessage = String(err.message || err);
    })
    .then(() => {
      assert.equal(asyncFunctionExecutedTooLong_called, true, "Test failed");
      assert.equal(deferredCancel_called, true, "Test failed");
      assert.equal(errMessage, "Timeout", "Test failed");
    });
}

function makeSleep(returnValue, timeoutMs = 0) {
  return function () {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(returnValue);
      }, timeoutMs);
    });
  };
}

/**
 * @this {NodeJS.Global|Window}
 * @returns {NodeJS.Global|Window}
 */
function getGlobalContext() {
  return (
    (typeof globalThis !== "undefined" ? globalThis : void 0) ||
    (typeof global !== "undefined" ? global : void 0) ||
    (typeof window !== "undefined" ? window : void 0) ||
    this
  );
}

/**
 * @this {NodeJS.Global|Window}
 */
function makeGlobalPromiseWithDefaultTimeout() {
  const DEFAULT_TIMEOUT = 20000;

  class PromiseWithDefaultTimeout extends Promise {
    constructor(executor) {
      /** @type {(ReturnType<typeof setTimeout>)|undefined} */
      let timer;

      super((resolve, reject) => {
        const _clearTimeout = () => {
          if (timer) {
            clearTimeout(timer);
            timer = void 0;
          }
        };
        const _resolve = (value) => {
          _clearTimeout();
          resolve(value);
        };
        const _reject = (error) => {
          _clearTimeout();
          reject(error);
        };

        timer = setTimeout(() => {
          timer = void 0;
          reject(new Error("Timeout"));
        }, DEFAULT_TIMEOUT);

        return executor(_resolve, _reject);
      });
    }
  }

  getGlobalContext.call(this).Promise = PromiseWithDefaultTimeout;
}
