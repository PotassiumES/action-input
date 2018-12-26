import InputSource from "./InputSource.js";

/**
 *  KeyboardInputSource watches keyup and keydown events and tracks key up/down state
 *
 *  /input/keyboard/*|0/key/*|keyCode
 */
export default class KeyboardInputSource extends InputSource {
  constructor(targetElement = document) {
    super();

    /** @type {Set<number>} */
    this._activeKeyCodes = new Set();

    targetElement.addEventListener("keydown", ev => {
      if (this._activeKeyCodes.has(ev.keyCode)) return;
      this._activeKeyCodes.add(ev.keyCode);
    });
    targetElement.addEventListener("keyup", ev => {
      if (this._activeKeyCodes.has(ev.keyCode) === false) return;
      this._activeKeyCodes.delete(ev.keyCode);
    });
  }

  /** @return {string} a human readable name */
  get name(){ return 'KeyboardInputSource' }

  /**
  @param partialPath {string} the relative semantic path for an input
  @return the value of the the input, or null if the path does not exist
  */
  queryInputPath(partialPath, result=null) {
    if(result === null) result = [false, null];

    if (partialPath.startsWith("/0/key/") === false && partialPath.startsWith("/*/key/") === false) {
      return result;
    }

    const lastToken = partialPath.substring(7);

    if (lastToken === "*") {
      const values = [];
      for (let value of this._activeKeyCodes.values()) {
        values[values.length] = value;
      }
      result[0] = values.length > 0
      result[1] = values
    }

    let keycode = Number.parseInt(lastToken, 10);
    if (Number.isNaN(keycode)) return result;
    result[0] = this._activeKeyCodes.has(keycode);
    return result
  }
}
