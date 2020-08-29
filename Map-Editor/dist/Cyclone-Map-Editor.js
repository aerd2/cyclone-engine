/*:
 * @target MZ
 * @plugindesc Live Map Editor
 *
 * <pluginName:CycloneMapEditor>
 * @author Hudell
 * @url https://makerdevs.com/plugin/cyclone-map-editor
 *
 * @help
 * ===========================================================================
 *                                    88
 *                                    88
 *                                    88
 *   ,adPPYba, 8b       d8  ,adPPYba, 88  ,adPPYba,  8b,dPPYba,   ,adPPYba,
 *  a8"     "" `8b     d8' a8"     "" 88 a8"     "8a 88P'   `"8a a8P_____88
 *  8b          `8b   d8'  8b         88 8b       d8 88       88 8PP"""""""
 *  "8a,   ,aa   `8b,d8'   "8a,   ,aa 88 "8a,   ,a8" 88       88 "8b,   ,aa
 *   `"Ybbd8"'     Y88'     `"Ybbd8"' 88  `"YbbdP"'  88       88  `"Ybbd8"'
 *                 d8'
 *                d8'
 * Live  Map Editor 1.00.00                                          by Hudell
 * ===========================================================================
 * Terms of Use
 * ===========================================================================
 * 1. For support, feature requests or bug reports, you may contact me through
 *  any of the following channels (in order of preference):
 *
 *   1.a. Opening an issue on the plugin's GitHub repository:
 *      https://github.com/Hudell/cyclone-engine
 *   1.b. Tagging me on threads on Rpg Maker related Forums, such as:
 *      rpgmakerweb.com (English)
 *      centrorpg.com (Portuguese)
 *      condadobraveheart.com (Portuguese)
 *   1.c. Opening threads on the plugin's itch.io page
 *   1.d. Tagging my user on Rpg Maker related sub-reddits, such as r/rpgmaker
 *
 * 2. Do not send me Direct Messages asking for support or bug reports.
 * You may only send me direct messages when none of the above platforms are
 * appropiate for it, or when you want to share pictures of cute dogs.
 *
 * 3. A special exception is created for patreon users who get access to my
 * priority support discord server.
 *
 * 4. Sending plugin related questions on channels related to any of my other
 * projects (such as my game's Discord server) may result in an immediate ban
 * from such platforms and I may also choose to ignore your future requests.
 *
 * 5. This plugin is released under the Apache License 2.0 (Apache-2.0).
 *
 * 6. You can send me your own changes to this plugin if you wish to see them
 * included in an update, by registering a Pull Request on the plugin's GitHub
 * repository.
 *
 * 7. This plugin is provided as is. While I'll often read feedback and offer
 * updates to my plugins, I am in no obligation to do so.
 *
 * 8. I'm not responsible for anything created with this plugin.
 * ===========================================================================
 * Did you know?
 * Early map makers used to include fake towns on their maps to identify
 * copies of their work.
 * ===========================================================================
 *
 * @param regionIcons
 * @text Region Icons
 * @type struct<RegionIcon>[]
 * @desc Configure certain regions to display an icon instead of the number
 *
 * @param Status Bar
 *
 * @param showMapId
 * @text Show Map Id
 * @parent Status Bar
 * @type boolean
 * @default true
 * @desc Should the Map Id be visible in the status bar?
 *
 * @param showTilesetId
 * @text Show Tileset Id
 * @parent Status Bar
 * @type boolean
 * @default true
 * @desc Should the Tileset Id be visible in the status bar?
 *
 * @param showPosition
 * @text Show Position
 * @parent Status Bar
 * @type boolean
 * @default true
 * @desc Should the X and Y position in the status bar?
 *
 * @param showCellTiles
 * @text Show Cell Tiles
 * @parent Status Bar
 * @type boolean
 * @default true
 * @desc Should the id of the current position tiles be displayed in the status bar?
 *
 * @param showRegionId
 * @text Show Region Id
 * @parent Status Bar
 * @type boolean
 * @default true
 * @desc Should the region id of the current position be displayed in the status bar?
 *
 * @param showTag
 * @text Show Terrain Tag
 * @parent Status Bar
 * @type boolean
 * @default true
 * @desc Should the terrain tag of the current position be displayed in the status bar?
 *
 * @param showCollision
 * @text Show Collision
 * @parent Status Bar
 * @type boolean
 * @default true
 * @desc Should the collision of the current position be displayed in the status bar?
 *
 * @param showLadder
 * @text Show Ladder
 * @parent Status Bar
 * @type boolean
 * @default true
 * @desc Should status bar indicate if the current position is a ladder?
 *
 * @param showBush
 * @text Show Bush
 * @parent Status Bar
 * @type boolean
 * @default true
 * @desc Should the status bar indicate if the current position is a bush?
 *
 * @param showCounter
 * @text Show Counter
 * @parent Status Bar
 * @type boolean
 * @default true
 * @desc Should the status bar indicate if the current position is a counter?
 *
 * @param showDamageFloor
 * @text Show Damage Floor
 * @parent Status Bar
 * @type boolean
 * @default true
 * @desc Should the status bar indicate if the current position is a damage floor tile?
 *
 *
 **/

/*~struct~RegionIcon:
 * @param regionId
 * @text Region Id
 * @type number
 * @desc The regionId to display an icon on
 *
 * @param icon
 * @text Icon
 * @type string
 * @desc Right click to select icon index
 */
(function () {
'use strict';

const trueStrings = Object.freeze(['TRUE', 'ON', '1', 'YES', 'T', 'V' ]);

class CyclonePlugin {
  static initialize(pluginName) {
    this.pluginName = pluginName;
    this.fileName = undefined;
    this.superClasses = new Map();
    this.params = {};
    this.structs = new Map();
    this.eventListeners = new Map();

    this.structs.set('Dictionary', {
      name: {
        type: 'string',
        defaultValue: '',
      },
      value: {
        type: 'string',
        defaultValue: '',
      },
    });
  }

  static register(paramMap = {}) {
    const dataMap = this.loadAllParams();
    this.loadParamMap(paramMap, dataMap);
  }

  static loadAllParams() {
    for (const plugin of globalThis.$plugins) {
      if (!plugin?.status) {
        continue;
      }
      if (!plugin?.description?.includes(`<pluginName:${ this.pluginName }`)) {
        continue;
      }

      this.fileName = plugin.name;
      const pluginParams = new Map();

      for (const paramName in plugin.parameters) {
        if (!paramName || paramName.startsWith('-')) {
          continue;
        }

        pluginParams.set(paramName, plugin.parameters[paramName]);
      }

      return pluginParams;
    }
  }

  static loadParamMap(paramMap, dataMap = undefined) {
    this.params = {};

    for (const key in paramMap) {
      if (!paramMap.hasOwnProperty(key)) {
        continue;
      }

      try {
        this.params[key] = this.parseParam(key, paramMap, dataMap);
      } catch(e) {
        console.error(`CycloneEngine crashed while trying to parse a parameter value (${ key }). Please report the following error to Hudell:`);
        console.log(e);
      }
    }

    return this.params;
  }

  static registerEvent(eventName, callback) {
    if (!this.eventListeners.has(eventName)) {
      this.eventListeners.set(eventName, new Set());
    }

    const listeners = this.eventListeners.get(eventName);
    listeners.add(callback);
  }

  static removeEventListener(eventName, callback) {
    if (!this.eventListeners.has(eventName)) {
      return;
    }

    const listeners = this.eventListeners.get(eventName);
    listeners.delete(callback);
  }

  static shouldReturnCallbackResult(result, { abortOnTrue, abortOnFalse, returnOnValue }) {
    if (result === false && abortOnFalse) {
      return true;
    }

    if (result === true && abortOnTrue) {
      return true;
    }

    if (result !== undefined && returnOnValue) {
      return true;
    }

    return false;
  }

  static runEvent(eventName, { abortOnTrue = false, abortOnFalse = false, returnOnValue = false } = {}, ...args) {
    if (!this.eventListeners.has(eventName)) {
      return;
    }

    const listeners = this.eventListeners.get(eventName);
    for (const callback of listeners) {
      if (typeof callback === 'number') {
        this.runCommonEvent(callback);
        continue;
      }
      if (typeof callback !== 'function') {
        console.error('CycloneEngine: Invalid callback type:');
        console.log(callback);
        continue;
      }

      const result = callback(...args);
      if (this.shouldReturnCallbackResult(result, { abortOnTrue, abortOnFalse, returnOnValue })) {
        return result;
      }
    }
  }

  static runCommonEvent(eventId) {
    const commonEvent = globalThis.$dataCommonEvents[eventId];
    if (!commonEvent) {
      return;
    }

    const interpreter = new Game_Interpreter(1);
    interpreter.setup(commonEvent.list, 0);

    if (!this._interpreters) {
      this._interpreters = new Set();
      // Tap into rpg maker core so we can update our interpreters in sync with the engine
      const oldUpdateMain = SceneManager.updateMain;
      SceneManager.updateMain = () => {
        oldUpdateMain.call(this);
        this.update();
      };
    }

    this._interpreters.add(interpreter);
  }

  static update() {
    if (!this._interpreters) {
      return;
    }

    for (const interpreter of this._interpreters) {
      interpreter.update();

      if (!interpreter.isRunning()) {
        this._interpreters.delete(interpreter);
      }
    }
  }

  static getPluginFileName() {
    return this.fileName ?? this.pluginName;
  }

  static _descriptorIsProperty(descriptor) {
    return descriptor.get || descriptor.set || !descriptor.value || typeof descriptor.value !== 'function';
  }

  static _getAllClassDescriptors(classObj, usePrototype = false) {
    if (classObj === Object) {
      return {};
    }

    const descriptors = Object.getOwnPropertyDescriptors(usePrototype ? classObj.prototype : classObj);
    let parentDescriptors = {};
    if (classObj.prototype) {
      const parentClass = Object.getPrototypeOf(classObj.prototype).constructor;
      if (parentClass !== Object) {
        parentDescriptors = this._getAllClassDescriptors(parentClass, usePrototype);
      }
    }

    return Object.assign({}, parentDescriptors, descriptors);
  }

  static _assignDescriptor(receiver, giver, descriptor, descriptorName) {
    if (this._descriptorIsProperty(descriptor)) {
      if (descriptor.get || descriptor.set) {
        Object.defineProperty(receiver, descriptorName, {
          get: descriptor.get,
          set: descriptor.set,
          enumerable: descriptor.enumerable,
          configurable: descriptor.configurable,
        });
      } else {
        Object.defineProperty(receiver, descriptorName, {
          value: descriptor.value,
          enumerable: descriptor.enumerable,
          configurable: descriptor.configurable,
        });
      }
    } else {
      receiver[descriptorName] = giver[descriptorName];
    }
  }

  static _applyPatch(baseClass, patchClass, $super, ignoredNames, usePrototype = false) {
    const baseMethods = this._getAllClassDescriptors(baseClass, usePrototype);

    const baseClassOrPrototype = usePrototype ? baseClass.prototype : baseClass;
    const patchClassOrPrototype = usePrototype ? patchClass.prototype : patchClass;
    const descriptors = Object.getOwnPropertyDescriptors(patchClassOrPrototype);
    let anyOverride = false;

    for (const methodName in descriptors) {
      if (ignoredNames.includes(methodName)) {
        continue;
      }

      if (methodName in baseMethods) {
        anyOverride = true;
        const baseDescriptor = baseMethods[methodName];
        this._assignDescriptor($super, baseClassOrPrototype, baseDescriptor, methodName);
      }

      const descriptor = descriptors[methodName];
      this._assignDescriptor(baseClassOrPrototype, patchClassOrPrototype, descriptor, methodName);
    }

    return anyOverride;
  }

  static patchClass(baseClass, patchFn) {
    const $super = {};
    const $prototype = {};
    const $dynamicSuper = {};
    const patchClass = patchFn($dynamicSuper, $prototype);

    if (typeof patchClass !== 'function') {
      throw new Error(`Invalid class patch for ${ baseClass.name }`);
    }

    const ignoredStaticNames = Object.getOwnPropertyNames(class {});
    const ignoredNames = Object.getOwnPropertyNames((class {}).prototype);
    const anyStaticOverride = this._applyPatch(baseClass, patchClass, $super, ignoredStaticNames);
    const anyNonStaticOverride = this._applyPatch(baseClass, patchClass, $prototype, ignoredNames, true);

    if (anyStaticOverride) {
      const descriptors = Object.getOwnPropertyDescriptors($super);
      for (const descriptorName in descriptors) {
        this._assignDescriptor($dynamicSuper, $super, descriptors[descriptorName], descriptorName);
      }

      if (anyNonStaticOverride) {
        $dynamicSuper.$prototype = $prototype;
      }
    } else  {
      Object.assign($dynamicSuper, $prototype);
    }

    this.superClasses[baseClass.name] = $dynamicSuper;
  }

  static isTrue(value) {
    if (typeof value !== 'string') {
      return Boolean(value);
    }

    return trueStrings.includes(value.toUpperCase());
  }

  static isFalse(value) {
    return !this.isTrue(value);
  }

  static getIntParam({ value, defaultValue }) {
    try {
      const result = parseInt(value);

      if (isNaN(result)) {
        return defaultValue;
      }

      return result;
    } catch(e) {
      if (value !== '') {
        console.error(`Cyclone Engine plugin ${ this.pluginName }: Param is expected to be an integer number, but the received value was '${ value }'.`);
      }
      return defaultValue;
    }
  }

  static getFloatParam({ value, defaultValue }) {
    try {
      const result = parseFloat(value.replace(',', '.'));

      if (isNaN(result)) {
        return defaultValue;
      }

      return result;
    } catch(e) {
      if (value !== '') {
        console.error(`Cyclone Engine plugin ${ this.pluginName }: Param is expected to be a number, but the received value was '${ value }'.`);
      }

      return defaultValue;
    }
  }

  static getIntListParam({ value }) {
    return this.parseArray((value ?? '').trim(), item => {
      try {
        return parseInt(item.trim());
      } catch(e) {
        if (item !== '') {
          console.error(`Cyclone Engine plugin ${ this.pluginName }: Param is expected to be a list of integer numbers, but one of the items was '${ item }'.`);
        }
        return 0;
      }
    });
  }

  static parseStructArrayParam({ data, type }) {
    const newData = [];
    for (const json of data) {
      const itemData = this.parseStructParam({ value: json, defaultValue: '', type });
      if (itemData) {
        newData.push(itemData);
      }
    }

    return newData;
  }

  static getFloatListParam({ value }) {
    return this.parseArray((value || '').trim(), item => {
      try {
        return parseFloat(item.trim());
      } catch(e) {
        if (item !== '') {
          console.error(`Cyclone Engine plugin ${ this.pluginName }: Param ${ name } is expected to be a list of numbers, but one of the items was '${ item }'.`);
        }
        return 0;
      }
    });
  }

  static getParam({ value, defaultValue, type }) {
    if (type.endsWith('[]')) {
      return this.parseArrayParam({ value, type });
    }

    if (type.startsWith('struct<')) {
      return this.parseStructParam({ value, defaultValue, type });
    }

    if (value === undefined) {
      return defaultValue;
    }

    switch(type) {
      case 'int':
        return this.getIntParam({value, defaultValue });
      case 'float':
        return this.getFloatParam({ value, defaultValue });
      case 'boolean':
        return (typeof value === 'boolean') ? value : this.isTrue(String(value).trim());
      default:
        return value;
    }
  }

  static getPluginParam(paramName) {
    return this.params.get(paramName);
  }

  static defaultValueForType(typeName) {
    switch(typeName) {
      case 'int':
        return 0;
      case 'boolean':
        return false;
    }

    return '';
  }

  static parseParam(key, paramMap, dataMap = undefined) {
    let paramData = paramMap[key];
    if (paramData && typeof paramData === 'string') {
      paramData = {
        type: paramData,
        defaultValue: this.defaultValueForType(paramData)
      };
    }

    const { name = key, type = 'string', defaultValue = '' } = paramData;
    let value;
    if (dataMap) {
      value = dataMap.get(name) ?? defaultValue;
    } else {
      const data = this.getPluginParam(name) || {};
      value = data.value ?? defaultValue;
    }
    return this.getParam({
      value,
      defaultValue,
      type
    });
  }

  static parseArrayParam({ value, type }) {
    const data = this.parseArray(value);
    if (!data || !data.length) {
      return data;
    }

    const itemType = type.substr(0, type.length - 2);

    const newData = [];
    for (const value of data) {
      const defaultValue = this.defaultValueForType(itemType);
      newData.push(this.getParam({ value, type: itemType, defaultValue }));
    }

    return newData;
  }

  static getRegexMatch(text, regex, matchIndex) {
    const matches = text.match(regex);
    return matches?.[matchIndex];
  }

  static parseStructParam({ value, defaultValue, type }) {
    let data;
    if (value) {
      try {
        data = JSON.parse(value);
      } catch (e) {
        console.error('Cyclone Engine failed to parse param structure: ', value);
        console.error(e);
      }
    }

    if (!data) {
      data = JSON.parse(defaultValue);
    }

    const structTypeName = this.getRegexMatch(type, /struct<(.*)>/i, 1);
    if (!structTypeName) {
      console.error(`Unknown plugin param type: ${ type }`);
      return data;
    }

    const structType = this.structs.get(structTypeName);
    if (!structType) {
      console.error(`Unknown param structure type: ${ structTypeName }`);
      return data;
    }

    for (const key in structType) {
      if (!structType.hasOwnProperty(key)) {
        continue;
      }

      let dataType = structType[key];
      if (typeof dataType === 'string') {
        dataType = {
          type: dataType,
          defaultValue: this.defaultValueForType(dataType),
        };
      }

      data[key] = this.getParam({
        value: data[key],
        defaultValue: dataType.defaultValue,
        type: dataType.type,
      });
    }

    return data;
  }

  static parseList(data, mapper) {
    let str = data;
    if (str.startsWith('[')) {
      str = str.substr(1);
    }
    if (str.endsWith(']')) {
      str = str.substr(0, str.length -1);
    }

    const list = str.split(',');

    if (mapper) {
      return list.map(item => mapper(item));
    }

    return list;
  }

  static parseArray(value, mapper) {
    let data;
    try {
      data = JSON.parse(value);
    } catch(e) {
      return [];
    }

    if (!data || !data.length) {
      return [];
    }

    if (mapper) {
      return data.map(item => mapper(item));
    }

    return data;
  }

  static buildMetadata(notes) {
    const rgx = /<([^<>:]+)(:?)([^>]*)>/g;
    const matches = notes.matchAll(rgx);
    const values = new Map();

    for (const match of matches) {
      if (match.length > 3 && match[2] === ':') {
        values.set(match[1], match[3]);
      } else {
        values.set(match[1], true);
      }
    }

    return values;
  }

  static defaultIfNaN(value, defaultValue) {
    if (isNaN(Number(value))) {
      return defaultValue;
    }

    return value;
  }

  static getValueMaybeVariable(rawValue) {
    const value = rawValue.trim();

    if (value.startsWith('$')) {
      const variableId = parseInt(value.slice(1));
      if (isNaN(variableId)) {
        throw new Error(`Invalid Variable ID: ${ variableId }`);
      }

      if (variableId === 0) {
        return 0;
      }

      return $gameVariables.value(variableId);
    }

    return value;
  }

  static debounce(fn, delay) {
    let clearTimer;
    return function(...args) {
      const context = this;
      clearTimeout(clearTimer);
      clearTimer = setTimeout(() => fn.call(context, ...args), delay);
    };
  }

  static _addProperty(classObj, propName, { getter: getterFn, setter: setterFn, lazy = false })  {
    if (lazy) {
      // Creates a property that replaces itself with the value the first time it's called.
      return Object.defineProperty(classObj, propName, {
        get: function() { // eslint-disable-line object-shorthand
          delete this[propName];
          const value = getterFn.call(this);
          Object.defineProperty(this, propName, { value });
          return value;
        },
        set: setterFn === true ? (function(value) {this[`_${ propName }`] = value; }) : undefined,
        configurable: true,
      });
    }

    return Object.defineProperty(classObj, propName, {
      get: getterFn ?? (function() { return this[`_${ propName }`]; }),
      set: setterFn === false ? undefined : (typeof setterFn === 'function' ? setterFn : (function(value) {this[`_${ propName }`] = value; })),
      configurable: false,
    });
  }

  static registerCommand(commandName, params, fn) {
    if (typeof params === 'function') {
      return PluginManager.registerCommand(this.getPluginFileName(), commandName, params);
    }

    return PluginManager.registerCommand(this.getPluginFileName(), commandName, (receivedArgs) => {
      const dataMap = new Map();
      for (const key in receivedArgs) {
        if (!receivedArgs.hasOwnProperty(key)) {
          continue;
        }
        dataMap.set(key, receivedArgs[key]);
      }
      const parsedArgs = this.loadParamMap(params, dataMap);
      Object.assign(receivedArgs, parsedArgs);

      return fn(receivedArgs);
    });
  }
}

const Layers = {
  shadows: 4,
  regions: 5,
  auto: 7,
  collisions: 8,
  tags: 9,
};

const layerVisibility = [true, true, true, true, true, false, false, false, false, false];
let editorActive = true;
let windowWidth = 408;
const mapCaches = {};

let currentLayer = 7;
let currentTab = 'A';
let currentTileId = undefined;
let tileCols = 1;
let tileRows = 1;
let selectedTileList = [];
let multiLayerSelection = [];
let tileWidth = 48;
let tileHeight = 48;
let currentTool = 'pencil';
let lastDrawingTool = 'pencil';
let wasPressing = false;
let isRightButtonDown = false;
let wasRightButtonDown = false;
let rectangleStartMouseX = 0;
let rectangleStartMouseY = 0;
let rectangleStartX = 0;
let rectangleStartY = 0;
let rectangleWidth = 0;
let rectangleHeight = 0;
let rectangleBackWidth = 0;
let rectangleBackHeight = 0;
const tabs = ['A', 'B', 'C', 'D', 'E'];
let changeHistory = [];
let undoHistory = [];
let currentChange = false;
let previewChanges = {};
let messySelection = false;
let showGrid = true;
let statusTileId = 0;
let statusMapX = 0;
let statusMapY = 0;
let statusTile1 = 0;
let statusTile2 = 0;
let statusTile3 = 0;
let statusTile4 = 0;
let statusRegion = 0;
let statusTag = 0;
let statusCollision = 0;
let statusBush = false;
let statusCounter = false;
let statusDamage = false;
let statusLadder = false;
let gridPreviewBlockHandler = false;
let gridNeedsRefresh = false;
let currentZoom = 1;

const _ = '';
const o = true;
const x = false;
const autoTileShapeTable = [
  // o means there's a compatible tile on that position,
  // x means there is no compatible tile on that position
  // _ means that position doesn't matter
  [o, o, o, o, o, o, o, o], // 0
  [x, o, o, o, o, o, o, o], // 1
  [o, o, x, o, o, o, o, o], // 2
  [x, o, x, o, o, o, o, o], // 3
  [o, o, o, o, o, o, o, x], // 4
  [x, o, o, o, o, o, o, x], // 5
  [o, o, x, o, o, o, o, x], // 6
  [x, o, x, o, o, o, o, x], // 7
  [o, o, o, o, o, x, o, o], // 8
  [x, o, o, o, o, x, o, o], // 9
  [o, o, x, o, o, x, o, o], //10
  [x, o, x, o, o, x, o, o], //11
  [o, o, o, o, o, x, o, x], //12
  [x, o, o, o, o, x, o, x], //13
  [o, o, x, o, o, x, o, x], //14
  [x, o, x, o, o, x, o, x], //15
  [_, o, o, x, o, _, o, o], //16
  [_, o, x, x, o, _, o, o], //17
  [_, o, o, x, o, _, o, x], //18
  [_, o, x, x, o, _, o, x], //19
  [_, x, _, o, o, o, o, o], //20
  [_, x, _, o, o, o, o, x], //21
  [_, x, _, o, o, x, o, o], //22
  [_, x, _, o, o, x, o, x], //23
  [o, o, _, o, x, o, o, _], //24
  [o, o, _, o, x, x, o, _], //25
  [x, o, _, o, x, o, o, _], //26
  [x, o, _, o, x, x, o, _], //27
  [o, o, o, o, o, _, x, _], //28
  [x, o, o, o, o, _, x, _], //29
  [o, o, x, o, o, _, x, _], //30
  [x, o, x, o, o, _, x, _], //31
  [_, o, _, x, x, _, o, _], //32
  [_, x, _, o, o, _, x, _], //33
  [_, x, _, x, o, _, o, o], //34
  [_, x, _, x, o, _, o, x], //35
  [_, x, _, o, x, o, o, _], //36
  [_, x, _, o, x, x, o, _], //37
  [o, o, _, o, x, _, x, _], //38
  [x, o, _, o, x, _, x, _], //39
  [_, o, o, x, o, _, x, _], //40
  [_, o, x, x, o, _, x, _], //41
  [_, x, _, x, x, _, o, _], //42
  [_, x, _, x, o, _, x, _], //43
  [_, o, _, x, x, _, x, _], //44
  [_, x, _, o, x, _, x, _], //45
  [_, x, _, x, x, _, x, _]  //46
];

const highLayerAutotiles = [
  1,
  2,
  3,
  20,
  21,
  22,
  23,
  28,
  29,
  30,
  31,
  36,
  37,
  38,
  39,
  44,
  45,
  46,
  47,
];

class CycloneMapEditor$1 extends CyclonePlugin {
  static get currentTab() {
    return currentTab;
  }
  static get active() {
    return editorActive;
  }
  static set active(value) {
    editorActive = value;
  }
  static get tileWidth() {
    return tileWidth;
  }
  static set tileWidth(value) {
    tileWidth = value;
  }
  static get tileHeight() {
    return tileHeight;
  }
  static set tileHeight(value) {
    tileHeight = value;
  }
  static get windowWidth() {
    return windowWidth;
  }
  static set windowWidth(value) {
    windowWidth = value;
  }

  static get isRightButtonDown() {
    return isRightButtonDown;
  }
  static set isRightButtonDown(value) {
    isRightButtonDown = value;
  }

  // the size of the rectangle tool when the user stretches it right
  static get rectangleWidth() { return rectangleWidth; }
  static set rectangleWidth(value) { rectangleWidth = value; }

  // The size of the rectangle tool when the user stretches it down
  static get rectangleHeight() { return rectangleHeight; }
  static set rectangleHeight(value) { rectangleHeight = value; }

  // the size of the rectangle tool when the user stretches it left
  static get rectangleBackWidth() { return rectangleBackWidth; }
  static set rectangleBackWidth(value) { rectangleBackWidth = value; }

  // The size of the rectangle tool when the user stretches it up
  static get rectangleBackHeight() { return rectangleBackHeight; }
  static set rectangleBackHeight(value) { rectangleBackHeight = value; }

  // The X tile where the rectangle started
  static get rectangleStartX() { return rectangleStartX; }
  static set rectangleStartX(value) { rectangleStartX = value; }

  // The Y tile where the rectangle started
  static get rectangleStartY() { return rectangleStartY; }
  static set rectangleStartY(value) { rectangleStartY = value; }

  static get tileCols() { return tileCols; }
  static set tileCols(value) { tileCols = value; }
  static get tileRows() { return tileRows; }
  static set tileRows(value) { tileRows = value; }

  // The Mouse X position where the rectangle started
  static get rectangleStartMouseX() { return rectangleStartMouseX; }
  static set rectangleStartMouseX(value) { rectangleStartMouseX = value; }

  // The Mouse Y position where the rectangle started
  static get rectangleStartMouseY() { return rectangleStartMouseY; }
  static set rectangleStartMouseY(value) { rectangleStartMouseY = value; }

  static get messySelection() { return messySelection; }
  static set messySelection(value) { messySelection = value; }

  static get changeHistory() { return changeHistory; }
  static get undoHistory() { return undoHistory; }
  static get layerVisibility() { return layerVisibility; }

  static get wasRightButtonDown() { return wasRightButtonDown; }
  static set wasRightButtonDown(value) { wasRightButtonDown = value; }
  static get wasPressing() { return wasPressing; }
  static set wasPressing(value) { wasPressing = value; }

  static get currentTool() { return currentTool; }
  static get currentLayer() { return currentLayer; }
  static get showGrid() { return showGrid; }
  static get previewChanges() { return previewChanges; }

  static get currentTileId() { return currentTileId; }
  static set currentTileId(value) { currentTileId = value; }
  static get selectedTileList() { return selectedTileList; }
  static set selectedTileList(value) { selectedTileList = value; }
  static get multiLayerSelection() { return multiLayerSelection; }
  static set multiLayerSelection(value) { multiLayerSelection = value; }

  static get statusTileId() { return statusTileId; }
  static set statusTileId(value) { statusTileId = value; }
  static get statusMapX() { return statusMapX; }
  static set statusMapX(value) { statusMapX = value; }
  static get statusMapY() { return statusMapY; }
  static set statusMapY(value) { statusMapY = value; }
  static get statusTile1() { return statusTile1; }
  static set statusTile1(value) { statusTile1 = value; }
  static get statusTile2() { return statusTile2; }
  static set statusTile2(value) { statusTile2 = value; }
  static get statusTile3() { return statusTile3; }
  static set statusTile3(value) { statusTile3 = value; }
  static get statusTile4() { return statusTile4; }
  static set statusTile4(value) { statusTile4 = value; }
  static get statusRegion() { return statusRegion; }
  static get statusTag() { return statusTag; }
  static get statusCollision() { return statusCollision; }
  static get statusBush() { return statusBush; }
  static get statusCounter() { return statusCounter; }
  static get statusDamage() { return statusDamage; }
  static get statusLadder() { return statusLadder; }

  static get mapCaches() { return mapCaches; }

  static get currentZoom() { return currentZoom; }
  static set currentZoom(value) {
    currentZoom = value;
    $gameScreen._zoomScale = value;

    if (SceneManager._scene instanceof Scene_Map) {
      $gameMap.zoom = new Point(value, value);
      SceneManager._scene._mapEditorGrid.refresh();
      SceneManager._scene._spriteset.updatePosition();
    }
  }

  static register() {
    super.initialize('CycloneMapEditor');

    this.structs.set('CycloneRegionIcon', {
      regionId: 'int',
      icon: 'int',
    });

    super.register({
      regionIcons: {
        type: 'struct<CycloneRegionIcon>[]',
        defaultValue: '[]',
      },
      showMapId: {
        type: 'boolean',
        defaultValue: true,
      },
      showTilesetId: {
        type: 'boolean',
        defaultValue: true,
      },
      showPosition: {
        type: 'boolean',
        defaultValue: true,
      },
      showCellTiles: {
        type: 'boolean',
        defaultValue: true,
      },
      showRegionId: {
        type: 'boolean',
        defaultValue: true,
      },
      showTag: {
        type: 'boolean',
        defaultValue: true,
      },
      showCollision: {
        type: 'boolean',
        defaultValue: true,
      },
      showLadder: {
        type: 'boolean',
        defaultValue: true,
      },
      showBush: {
        type: 'boolean',
        defaultValue: true,
      },
      showCounter: {
        type: 'boolean',
        defaultValue: true,
      },
      showDamageFloor: {
        type: 'boolean',
        defaultValue: true,
      },
    });

    document.addEventListener('keydown', (...args) => {
      this.onKeyDown(...args);
    });
    document.addEventListener('keypress', (...args) => {
      this.onKeyPress(...args);
    });
    document.addEventListener('keyup', (...args) => {
      this.onKeyUp(...args);
    });

    const regionIcons = this.params.regionIcons;
    this.regionIcons = new Map();
    if (regionIcons) {
      for (const { regionId, icon } of regionIcons) {
        if (regionId && icon) {
          this.regionIcons.set(regionId, icon);
        }
      }
    }

    this.addMenuBar();
  }

  static addMenuBar() {
    if (!Utils.isNwjs()) {
      return;
    }

    const menu = new nw.Menu({ type: 'menubar' });

    const fileMenu = new nw.Menu();
    fileMenu.append(new nw.MenuItem( {
      label: 'Save',
      key: 's',
      modifiers: 'ctrl',
      click: () => {
        CycloneMapEditor$1.saveButton();
      }
    }));
    fileMenu.append(new nw.MenuItem( {
      label: 'Reload',
      key: 'r',
      modifiers: 'ctrl',
      click: () => {
        CycloneMapEditor$1.reloadButton();
      }
    }));

    fileMenu.append(new nw.MenuItem( {type: 'separator'}));
    fileMenu.append(new nw.MenuItem( {label: 'Exit', click: () => {
      window.close();
    }}));

    menu.append(new nw.MenuItem({
      label: 'File',
      submenu: fileMenu,
    }));

    const editMenu = new nw.Menu();
    editMenu.append(new nw.MenuItem( {
      label: 'Undo',
      key: 'z',
      modifiers: 'ctrl',
      click: () => {
        CycloneMapEditor$1.undoButton();
      }
    }));
    editMenu.append(new nw.MenuItem( {
      label: 'Redo',
      key: 'y',
      modifiers: 'ctrl',
      click: () => {
        CycloneMapEditor$1.redoButton();
      }
    }));
    editMenu.append(new nw.MenuItem( {type: 'separator'}));
    this.showGridMenu = new nw.MenuItem( {
      label: 'Show Grid',
      type: 'checkbox',
      checked: showGrid,
      key: 'g',
      modifiers: 'ctrl',
      click: () => {
        CycloneMapEditor$1.showGridButton();
      }
    });
    editMenu.append(this.showGridMenu);

    // const zoomMenu = new nw.Menu();
    // this.zoom30Menu = new nw.MenuItem({
    //   label: '30%',
    //   type: 'checkbox',
    //   checked: currentZoom === 0.3,
    //   click: () => {
    //     this.currentZoom = 0.3;

    //   },
    // });
    // zoomMenu.append(this.zoom30Menu);
    // this.zoom50Menu = new nw.MenuItem({
    //   label: '50%',
    //   type: 'checkbox',
    //   checked: currentZoom === 0.5,
    //   click: () => {
    //     this.currentZoom = 0.5;

    //   },
    // });
    // zoomMenu.append(this.zoom50Menu);
    // this.zoom67Menu = new nw.MenuItem({
    //   label: '67%',
    //   type: 'checkbox',
    //   checked: currentZoom === 0.67,
    //   click: () => {
    //     this.currentZoom = 0.67;

    //   },
    // });
    // zoomMenu.append(this.zoom67Menu);
    // this.zoom75Menu = new nw.MenuItem({
    //   label: '75%',
    //   type: 'checkbox',
    //   checked: currentZoom === 0.75,
    //   click: () => {
    //     this.currentZoom = 0.75;

    //   },
    // });
    // zoomMenu.append(this.zoom75Menu);
    // this.zoom90Menu = new nw.MenuItem({
    //   label: '90%',
    //   type: 'checkbox',
    //   checked: currentZoom === 0.9,
    //   click: () => {
    //     this.currentZoom = 0.9;

    //   },
    // });
    // zoomMenu.append(this.zoom90Menu);
    // this.zoom100Menu = new nw.MenuItem({
    //   label: '100%',
    //   type: 'checkbox',
    //   checked: currentZoom === 1,
    //   click: () => {
    //     this.currentZoom = 1;

    //   },
    // });
    // zoomMenu.append(this.zoom100Menu);
    // this.zoom150Menu = new nw.MenuItem({
    //   label: '150%',
    //   type: 'checkbox',
    //   checked: currentZoom === 1.5,
    //   click: () => {
    //     this.currentZoom = 1.5;

    //   },
    // });
    // zoomMenu.append(this.zoom150Menu);

    // editMenu.append(new nw.MenuItem({
    //   label: 'Zoom',
    //   submenu: zoomMenu,
    // }));

    menu.append(new nw.MenuItem({
      label: 'Edit',
      submenu: editMenu,
    }));

    const drawMenu = new nw.Menu();
    this.pencilMenu = new nw.MenuItem( {
      label: 'Pencil',
      type: 'checkbox',
      checked: currentTool === 'pencil',
      key: 'p',
      click: () => {
        CycloneMapEditor$1.pencilButton();
      }
    });
    drawMenu.append(this.pencilMenu);
    this.rectangleMenu = new nw.MenuItem( {
      label: 'Rectangle',
      type: 'checkbox',
      checked: currentTool === 'rectangle',
      key: 'r',
      click: () => {
        CycloneMapEditor$1.rectangleButton();
      }
    });
    drawMenu.append(this.rectangleMenu);
    this.fillMenu = new nw.MenuItem( {
      label: 'Flood Fill',
      type: 'checkbox',
      checked: currentTool === 'fill',
      key: 'f',
      click: () => {
        CycloneMapEditor$1.fillButton();
      }
    });
    drawMenu.append(this.fillMenu);
    drawMenu.append(new nw.MenuItem( {type: 'separator'}));
    this.eraserMenu = new nw.MenuItem( {
      label: 'Eraser',
      type: 'checkbox',
      checked: currentTool === 'eraser',
      key: 'e',
      click: () => {
        CycloneMapEditor$1.eraserButton();
      }
    });
    drawMenu.append(this.eraserMenu);

    menu.append(new nw.MenuItem({
      label: 'Draw',
      submenu: drawMenu,
    }));

    const layerMenu = new nw.Menu();
    this.autoLayerButton = new nw.MenuItem( {
      label: 'Automatic',
      type: 'checkbox',
      checked: currentLayer === 7,
      key: '0',
      click: () => {
        CycloneMapEditor$1.changeCurrentLayer(7);
      }
    });
    this.layer1Button = new nw.MenuItem( {
      label: 'Layer 1',
      type: 'checkbox',
      checked: currentLayer === 0,
      key: '1',
      click: () => {
        CycloneMapEditor$1.changeCurrentLayer(0);
      }
    });
    this.layer2Button = new nw.MenuItem( {
      label: 'Layer 2',
      type: 'checkbox',
      checked: currentLayer === 1,
      key: '2',
      click: () => {
        CycloneMapEditor$1.changeCurrentLayer(1);
      }
    });
    this.layer3Button = new nw.MenuItem( {
      label: 'Layer 3',
      type: 'checkbox',
      checked: currentLayer === 2,
      key: '3',
      click: () => {
        CycloneMapEditor$1.changeCurrentLayer(2);
      }
    });
    this.layer4Button = new nw.MenuItem( {
      label: 'Layer 4',
      type: 'checkbox',
      checked: currentLayer === 3,
      key: '4',
      click: () => {
        CycloneMapEditor$1.changeCurrentLayer(3);
      }
    });
    layerMenu.append(this.autoLayerButton);
    layerMenu.append(this.layer1Button);
    layerMenu.append(this.layer2Button);
    layerMenu.append(this.layer3Button);
    layerMenu.append(this.layer4Button);

    layerMenu.append(new nw.MenuItem( {type: 'separator'}));
    this.shadowsButton = new nw.MenuItem( {
      label: 'Shadows',
      type: 'checkbox',
      checked: currentLayer === 4,
      key: '5',
      click: () => {
        CycloneMapEditor$1.changeCurrentLayer(4);
      }
    });
    layerMenu.append(this.shadowsButton);
    this.regionsButton = new nw.MenuItem( {
      label: 'Regions',
      type: 'checkbox',
      checked: currentLayer === 5,
      key: '6',
      click: () => {
        CycloneMapEditor$1.changeCurrentLayer(5);
      }
    });
    layerMenu.append(this.regionsButton);
    layerMenu.append(new nw.MenuItem( {type: 'separator'}));
    this.collisionsButton = new nw.MenuItem( {
      label: 'Collisions',
      type: 'checkbox',
      checked: currentLayer === 8,
      key: '8',
      click: () => {
        CycloneMapEditor$1.changeCurrentLayer(8);
      }
    });
    layerMenu.append(this.collisionsButton);
    this.tagsButton = new nw.MenuItem( {
      label: 'Tags',
      type: 'checkbox',
      checked: currentLayer === 9,
      key: '9',
      click: () => {
        CycloneMapEditor$1.changeCurrentLayer(9);
      }
    });
    layerMenu.append(this.tagsButton);

    menu.append(new nw.MenuItem({
      label: 'Layer',
      submenu: layerMenu,
    }));

    const helpMenu = new nw.Menu();
    helpMenu.append(new nw.MenuItem( {
      label: 'Plugin Page',
      key: 'F1',
      click: () => {
        if (!globalThis.require) {
          return;
        }

        require('nw.gui').Shell.openExternal('https://makerdevs.com/plugin/cyclone-map-editor');
      },
    }));

    menu.append(new nw.MenuItem({
      label: 'Help',
      submenu: helpMenu,
    }));

    this.menu = menu;
  }

  static clearAllData() {
    changeHistory = [];
    undoHistory = [];
    rectangleStartMouseX = 0;
    rectangleStartMouseY = 0;
    rectangleStartX = 0;
    rectangleStartY = 0;
    rectangleWidth = 0;
    rectangleHeight = 0;
    rectangleBackWidth = 0;
    rectangleBackHeight = 0;

    this.clearSelection();
  }

  static clearSelection() {
    currentTileId = undefined;
    tileCols = 1;
    tileRows = 1;
    selectedTileList = [];
    multiLayerSelection = [];
  }

  static shouldDisplayMenu() {
    if (!editorActive) {
      return false;
    }

    if (!(SceneManager._scene instanceof Scene_Map)) {
      return false;
    }

    return true;
  }

  static refreshScreenSize() {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }

    if (Graphics._isFullScreen()) {
      return;
    }

    this.resizeTimeout = setTimeout(() => {
      // Adds a second timeout to block the show/hide functionality for a little while
      this.resizeTimeout = setTimeout(() => {
        this.resizeTimeout = false;
      }, 500);

      const xDelta = Graphics.width - window.innerWidth;
      const yDelta = Graphics.height - window.innerHeight;
      window.moveBy(-xDelta / 2, -yDelta / 2);
      window.resizeBy(xDelta, yDelta);
    }, 20);
  }

  static refreshMenuVisibility() {
    if (!Utils.isNwjs()) {
      return;
    }

    const display = this.shouldDisplayMenu();
    const win = nw.Window.get();

    if (display && win.menu === this.menu) {
      return;
    }

    if (display) {
      win.menu = this.menu;

      // return;
    } else {
      win.menu = null;
    }

    this.refreshScreenSize();
  }

  static isTabValid(tab) {
    const tileset = $gameMap.tileset();
    if (!tileset) {
      return false;
    }

    const names = tileset.tilesetNames;

    if (tab === 'A') {
      return Boolean(names[0] || names[1] || names[2] || names[3] || names[4]);
    }

    const tilesetIndex = tabs.indexOf(tab) + 4;
    return Boolean(names[tilesetIndex]);
  }

  static validTabs() {
    return tabs.filter(tab => this.isTabValid(tab));
  }

  static areRegionsVisible() {
    return layerVisibility[5];
  }

  static isLayerVisible(index) {
    if (index === 8 || index === 9) {
      return currentLayer === index;
    }

    if (index === 7) {
      return true;
    }

    return layerVisibility[index];
  }

  static selectPreviousTab() {
    const validTabs = this.validTabs();
    const oldIndex = validTabs.indexOf(currentTab).clamp(0, validTabs.length - 1);

    const index = oldIndex === 0 ? validTabs.length -1 : oldIndex -1;
    this.changeCurrentTab(validTabs[index % validTabs.length]);
  }

  static selectNextTab() {
    const validTabs = this.validTabs();
    const oldIndex = validTabs.indexOf(currentTab).clamp(0, validTabs.length - 1);

    const index = oldIndex +1;
    this.changeCurrentTab(validTabs[index % validTabs.length]);
  }

  static onKeyDown(event) {
    if (!editorActive) {
      return;
    }

    const scene = SceneManager._scene;
    if (!(scene instanceof Scene_Map)) {
      return;
    }

    if (event.keyCode === 8 || event.keyCode === 46) {
      this.eraserButton();
      return;
    }

    if (event.keyCode === 33) {
      this.selectPreviousTab();
      return;
    }

    if (event.keyCode === 34) {
      this.selectNextTab();
      return;
    }
  }

  static checkNumKeys(code) {
    switch(code) {
      case 'Numpad0':
        this.changeCurrentLayer(7);
        break;
      case 'Numpad1':
        this.changeCurrentLayer(0);
        break;
      case 'Numpad2':
        this.changeCurrentLayer(1);
        break;
      case 'Numpad3':
        this.changeCurrentLayer(2);
        break;
      case 'Numpad4':
        this.changeCurrentLayer(3);
        break;
      case 'Numpad5':
        this.changeCurrentLayer(4);
        break;
      case 'Numpad6':
        this.changeCurrentLayer(5);
        break;
      case 'Numpad8':
        this.changeCurrentLayer(8);
        break;
      case 'Numpad9':
        this.changeCurrentLayer(9);
        break;
    }
  }

  static checkLayerKeys(key) {
    switch(key) {
      case '0':
        this.changeCurrentLayer(7);
        break;
      case '1':
        this.changeCurrentLayer(0);
        break;
      case '2':
        this.changeCurrentLayer(1);
        break;
      case '3':
        this.changeCurrentLayer(2);
        break;
      case '4':
        this.changeCurrentLayer(3);
        break;
      case '5':
        this.changeCurrentLayer(4);
        break;
      case '6':
        this.changeCurrentLayer(5);
        break;
      case '8':
        this.changeCurrentLayer(8);
        break;
      case '9':
        this.changeCurrentLayer(9);
        break;
    }
  }

  static checkScrollKeys(key) {
    switch(key) {
      case 'w':
        $gameMap.scrollUp(3);
        break;
      case 'a':
        $gameMap.scrollLeft(3);
        break;
      case 's':
        $gameMap.scrollDown(3);
        break;
      case 'd':
        $gameMap.scrollRight(3);
        break;
    }
  }

  static loadMapFile() {
    SceneManager._scene._mapEditorCommands.hide();
    delete mapCaches[$gameMap._mapId];
    const fileName = `Map${ $gameMap._mapId.padZero(3) }.json`;

    const xhr = new XMLHttpRequest();
    const url = `data/${ fileName }`;

    xhr.open('GET', url);
    xhr.overrideMimeType('application/json');

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);

        // eslint-disable-next-line no-global-assign
        $dataMap = data;
        SoundManager.playLoad();
        SceneManager.goto(Scene_Map);
      } catch (e) {
        alert('Failed to parse map data.');
        SceneManager._scene.refreshMapEditorWindows();
      }
    };
    xhr.onerror = () => {
      alert('Failed to load map file from disk.');
      SceneManager._scene.refreshMapEditorWindows();
    };

    xhr.send();
  }

  static undoButton() {
    if (!(SceneManager._scene instanceof Scene_Map)) {
      return;
    }

    if (changeHistory.length) {
      this.undoLastChange();
    }
  }

  static redoButton() {
    if (!(SceneManager._scene instanceof Scene_Map)) {
      return;
    }

    if (undoHistory.length) {
      this.redoLastUndoneChange();
    }
  }

  // eslint-disable-next-line complexity
  static getCollisionSymbol(x, y) {
    const downCollision = !$gameMap.isPassable(x, y, 2);
    const leftCollision = !$gameMap.isPassable(x, y, 4);
    const rightCollision = !$gameMap.isPassable(x, y, 6);
    const upCollision = !$gameMap.isPassable(x, y, 8);

    if (downCollision && leftCollision && rightCollision && upCollision) {
      return 'X';
    }

    if (!downCollision && !leftCollision && !rightCollision && !downCollision) {
      return 'O';
    }

    let collisions = '';
    if (downCollision) {
      collisions += 'd:X ';
    } else {
      collisions += 'd:O ';
    }

    if (leftCollision) {
      collisions += 'l:X ';
    } else {
      collisions += 'l:O ';
    }
    if (rightCollision) {
      collisions += 'r:X ';
    } else {
      collisions += 'r:O ';
    }
    if (upCollision) {
      collisions += 'u:X ';
    } else {
      collisions += 'u:O ';
    }

    return collisions;
  }

  // eslint-disable-next-line complexity
  static updateStatus({ tileId, mapX, mapY, tile1, tile2, tile3, tile4 } = {}) {
    const oldTileId = statusTileId;
    const oldX = statusMapX;
    const oldY = statusMapY;
    const oldTile1 = statusTile1;
    const oldTile2 = statusTile2;
    const oldTile3 = statusTile3;
    const oldTile4 = statusTile4;

    statusTileId = tileId ?? statusTileId;
    statusMapX = mapX ?? statusMapX;
    statusMapY = mapY ?? statusMapY;
    statusTile1 = tile1 ?? statusTile1;
    statusTile2 = tile2 ?? statusTile2;
    statusTile3 = tile3 ?? statusTile3;
    statusTile4 = tile4 ?? statusTile4;


    const changedPos = oldX !== statusMapX || oldY !== statusMapY;
    if (changedPos) {
      statusRegion = $gameMap.regionId(statusMapX, statusMapY);
      statusTag = $gameMap.terrainTag(statusMapX, statusMapY);
      statusBush = $gameMap.isBush(statusMapX, statusMapY);
      statusCounter = $gameMap.isCounter(statusMapX, statusMapY);
      statusDamage = $gameMap.isDamageFloor(statusMapX, statusMapY);
      statusLadder = $gameMap.isLadder(statusMapX, statusMapY);
      statusCollision = this.getCollisionSymbol(statusMapX, statusMapY);
    }

    const changedTile = oldTile1 !== statusTile1 || oldTile2 !== statusTile2 || oldTile3 !== statusTile3 || oldTile4 !== statusTile4;
    const changed = changedTile || oldTileId !== statusTileId || changedPos;
    if (!changed) {
      return;
    }

    if (SceneManager._scene instanceof Scene_Map) {
      SceneManager._scene._mapEditorStatus.refresh();
    }
  }

  static showGridButton() {
    if (!(SceneManager._scene instanceof Scene_Map)) {
      return;
    }

    showGrid = !showGrid;
    this.showGridButton.checked = showGrid;
    SceneManager._scene._mapEditorGrid.refresh();
  }

  static selectHigherLayer(x, y) {
    for (let z = 3; z >= 0; z--) {
      const tileIndex = this.tileIndex(x, y, z);
      const tileId = $dataMap.data[tileIndex];

      if (tileId) {
        this.changeCurrentLayer(z);
        return;
      }
    }
  }

  static updateCurrentTool() {
    rectangleWidth = 0;
    rectangleHeight = 0;
    rectangleBackWidth = 0;
    rectangleBackHeight = 0;
    rectangleStartX = 0;
    rectangleStartY = 0;
    rectangleStartMouseX = 0;
    rectangleStartMouseY = 0;

    this.pencilMenu.checked = currentTool === 'pencil';
    this.rectangleMenu.checked = currentTool === 'rectangle';
    this.fillMenu.checked = currentTool === 'fill';
    this.eraserMenu.checked = currentTool === 'eraser';
    this.refreshMapEditor();
  }

  static pencilButton() {
    if (!(SceneManager._scene instanceof Scene_Map)) {
      return;
    }

    currentTool = 'pencil';
    lastDrawingTool = 'pencil';

    this.updateCurrentTool();
  }

  static rectangleButton() {
    if (!(SceneManager._scene instanceof Scene_Map)) {
      return;
    }

    currentTool = 'rectangle';
    lastDrawingTool = 'rectangle';

    this.updateCurrentTool();
  }

  static fillButton() {
    if (!(SceneManager._scene instanceof Scene_Map)) {
      return;
    }

    currentTool = 'fill';
    this.updateCurrentTool();
  }

  static eraserButton() {
    if (!(SceneManager._scene instanceof Scene_Map)) {
      return;
    }

    currentTool = 'eraser';

    this.updateCurrentTool();
  }

  static _doWebSave(json, fileName) {
    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${ encodeURIComponent(json) }`);
    element.setAttribute('download', fileName);
    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  static _doLocalSave(json, fileName) {
    const fs = require('fs');
    const path = require('path');

    const projectFolder = path.dirname(process.mainModule.filename);
    const dataFolder = path.join(projectFolder, 'data');

    const filePath = path.join(dataFolder, fileName);

    fs.writeFileSync(filePath, json);
  }

  static _doSave() {
    const fileName = `Map${ $gameMap._mapId.padZero(3) }.json`;
    const json = JSON.stringify($dataMap, null, 0);

    if (Utils.isNwjs()) {
      this._doLocalSave(json, fileName);
    } else {
      this._doWebSave(json, fileName);
    }
    SoundManager.playSave();
  }

  static saveButton() {
    if (!(SceneManager._scene instanceof Scene_Map)) {
      return;
    }

    if (!confirm('Are you sure you want to SAVE the map file?')) {
      SceneManager._scene.refreshMapEditorWindows();
      return;
    }

    SceneManager._scene._mapEditorCommands.hide();

    this._doSave();
    SceneManager._scene.refreshMapEditorWindows();
  }

  static reloadButton() {
    if (!(SceneManager._scene instanceof Scene_Map)) {
      return;
    }

    if (!confirm('Are you sure you want to RELOAD the map file?')) {
      SceneManager._scene.refreshMapEditorWindows();
      return;
    }

    this.clearAllData();
    this.loadMapFile();
  }

  static onKeyPress(event) {
    if (editorActive) {
      this.checkScrollKeys(event.key);
    }
  }

  static checkWebShortcuts(key) {
    switch (key) {
      case 'e':
        return this.eraserButton();
      case 'r':
        return this.rectangleButton();
      case 'p':
        return this.pencilButton();
      case 'f':
        return this.fillButton();
    }

  }

  static checkControlKeys(code) {
    switch (code) {
      case 'KeyZ':
        return this.undoButton();
      case 'KeyY':
        return this.redoButton();
      case 'KeyS':
        return this.saveButton();
      case 'KeyR':
        return this.reloadButton();
      case 'KeyG':
        return this.showGridButton();
    }
  }

  static onKeyUp(event) {
    if (!Utils.isNwjs()) {
      if (Input.isPressed('control')) {
        this.checkControlKeys(event.code);
        return;
      }

      this.checkWebShortcuts(event.key);
      this.checkLayerKeys(event.key);
    }

    if (event.key === 'h') {
      this.toggleMapEditor();
      return;
    }

    this.checkNumKeys(event.code);
  }

  static toggleMapEditor() {
    if (this.resizeTimeout) {
      return;
    }

    const scene = SceneManager._scene;
    if (!(scene instanceof Scene_Map)) {
      return;
    }

    scene.toggleMapEditor();
  }

  static refreshMapEditor() {
    const scene = SceneManager._scene;
    if (!(scene instanceof Scene_Map)) {
      return;
    }

    scene.refreshMapEditorWindows();
  }

  static getTileIdTilesetIndex(tileId) {
    if (tileId < Tilemap.TILE_ID_A5) {
      const tilesetIndex = Math.floor(tileId / 256);
      if (tilesetIndex >= 0 && tilesetIndex < 4) {
        return 5 + tilesetIndex;
      }

      return -1;
    }

    if (tileId < Tilemap.TILE_ID_A1) {
      return 4;
    }

    if (tileId < Tilemap.TILE_ID_A2) {
      return 0;
    }

    if (tileId < Tilemap.TILE_ID_A3) {
      return 1;
    }

    if (tileId < Tilemap.TILE_ID_A4) {
      return 2;
    }

    if (tileId < Tilemap.TILE_ID_MAX) {
      return 3;
    }

    return -1;
  }

  static getTilesetName(tileId) {
    const tileset = $gameMap.tileset();
    if (!tileset) {
      return;
    }

    const tilesetIndex = this.getTileIdTilesetIndex(tileId);
    if (tilesetIndex < 0) {
      return;
    }

    return tileset.tilesetNames[tilesetIndex];
  }

  static loadTilesetBitmap(tileId) {
    const realFileName = this.getTilesetName(tileId);
    if (realFileName) {
      return ImageManager.loadTileset(realFileName);
    }
  }

  static deselectShadowOrRegion(newLayerIndex) {
    // coming from or to shadows/regions, then de-select the current index
    if (currentLayer === 4 || currentLayer === 5 || newLayerIndex === 4 || newLayerIndex === 5) {
      this.clearSelection();
    }
  }

  static changeCurrentLayer(newIndex) {
    if (newIndex >= layerVisibility.length) {
      return;
    }

    this.deselectShadowOrRegion(newIndex);

    currentLayer = newIndex;
    if (Utils.isNwjs()) {
      this.layer1Button.checked = newIndex === 0;
      this.layer2Button.checked = newIndex === 1;
      this.layer3Button.checked = newIndex === 2;
      this.layer4Button.checked = newIndex === 3;
      this.shadowsButton.checked = newIndex === 4;
      this.regionsButton.checked = newIndex === 5;
      this.autoLayerButton.checked = newIndex === 7;
      this.collisionsButton.checked = newIndex === 8;
      this.tagsButton.checked = newIndex === 9;
    }

    if (SceneManager._scene instanceof Scene_Map) {
      SceneManager._scene._mapEditorLayerListWindow.refresh();
      SceneManager._scene._mapEditorWindow.refresh();
      SceneManager._scene._mapEditorStatus.refresh();
      SceneManager._scene._mapEditorGrid.refresh();
      SceneManager._scene._spriteset._mapEditorCursor.updateDrawing();
    }
  }

  static changeCurrentTab(tabLetter) {
    currentTab = tabLetter;
    this.refreshMapEditor();
  }

  static tileIndex(x, y, z) {
    return (z * $gameMap.height() + (y % $gameMap.height())) * $gameMap.width() + (x % $gameMap.width());
  }

  static indexPositionX(index, z) {
    const y = this.indexPositionY(index, z);
    return index - this.tileIndex(0, y, z);
  }

  static indexPositionY(index, z) {
    return Math.floor((index / $gameMap.width()) - (z * $gameMap.height()));
  }

  static getCurrentTileAtPosition(x, y, z, skipPreview = true) {
    if (x < 0 || y < 0 || x >= $gameMap.width() || y >= $gameMap.height()) {
      return 0;
    }

    const tileIndex = this.tileIndex(x, y, z);
    if (!skipPreview) {
      if (previewChanges[tileIndex] !== undefined) {
        return previewChanges[tileIndex];
      }
    }

    return $dataMap.data[tileIndex] ?? 0;
  }

  static isSameKindTile(tileId, x, y, z, skipPreview = true) {
    return Tilemap.isSameKindTile(tileId, this.getCurrentTileAtPosition(x, y, z, skipPreview));
  }

  static getWallColumnTypeForPosition(x, y, z, tileId, skipPreview = true) {
    // wall auto tiles need the left and right columns to have the same amount of rows for it to match
    let hasLeftColumn = true;
    let hasRightColumn = true;

    const compareWallAutoTileLine = (newY, sameCenter) => {
      const leftTileId = this.getCurrentTileAtPosition(x -1, newY, z, skipPreview);
      const rightTileId = this.getCurrentTileAtPosition(x + 1, newY, z, skipPreview);

      if (sameCenter) {
        if (!Tilemap.isSameKindTile(tileId, leftTileId)) {
          hasLeftColumn = false;
        }
        if (!Tilemap.isSameKindTile(tileId, rightTileId)) {
          hasRightColumn = false;
        }
      } else {
        if (Tilemap.isSameKindTile(tileId, leftTileId)) {
          hasLeftColumn = false;
        }
        if (Tilemap.isSameKindTile(tileId, rightTileId)) {
          hasRightColumn = false;
        }
      }
    };

    for (let newY = y; y < $gameMap.height(); y++) {
      const centerTileId = this.getCurrentTileAtPosition(x, newY, z, skipPreview);
      const sameCenter = Tilemap.isSameKindTile(tileId, centerTileId);
      compareWallAutoTileLine(newY, sameCenter);
      if (!sameCenter) {
        break;
      }
    }

    for (let newY = y -1; y >= 0; y--) {
      const centerTileId = this.getCurrentTileAtPosition(x, newY, z, skipPreview);
      const sameCenter = Tilemap.isSameKindTile(tileId, centerTileId);
      compareWallAutoTileLine(newY, sameCenter);
      if (!sameCenter) {
        break;
      }
    }

    if (hasLeftColumn) {
      if (hasRightColumn) {
        return 1;
      }

      return 2;
    }

    if (hasRightColumn) {
      return 0;
    }

    return 3;
  }

  static getWaterfallShapeForPosition(x, y, z, tileId, skipPreview = true) {
    const left = this.isSameKindTile(tileId, x - 1, y, z, skipPreview);
    const right = this.isSameKindTile(tileId, x + 1, y, z, skipPreview);

    if (left && right) {
      return 0;
    }

    if (left) {
      return 1;
    }

    if (right) {
      return 2;
    }

    return 3;
  }

  static getWallShapeForPosition(x, y, z, tileId, skipPreview = true) {
    const columnType = this.getWallColumnTypeForPosition(x, y, z, tileId, skipPreview);

    let shape = 0;
    const above = this.isSameKindTile(tileId, x, y -1, z, skipPreview);
    const below = this.isSameKindTile(tileId, x, y +1, z, skipPreview);

    if (above && below) {
      shape = 0;
    } else if (above) {
      shape = 8;
    } else if (below) {
      shape = 2;
    } else {
      shape = 10;
    }

    switch (columnType) {
      case 0:
        shape += 1;
        break;
      case 2:
        shape += 4;
        break;
      case 3:
        shape += 5;
        break;
    }

    return shape;
  }

  static getShapeForConfiguration(configuration) {
    for (let shape = 0; shape < autoTileShapeTable.length; shape++) {
      const shapeData = autoTileShapeTable[shape];
      let valid = true;

      for (let i = 0; i < configuration.length; i++) {
        const config = shapeData[i];

        if (config === true) {
          if (!configuration[i]) {
            valid = false;
            break;
          }
        } else if (config === false) {
          if (configuration[i]) {
            valid = false;
            break;
          }
        }
      }

      if (valid) {
        return shape;
      }
    }

    return 46;
  }


  static isAutotileMatch(tileId, x, y, z, skipPreview = true) {
    if (!$gameMap.isValid(x, y)) {
      return true;
    }

    const otherTileId = this.getCurrentTileAtPosition(x, y, z, skipPreview);

    if (Tilemap.isSameKindTile(tileId, otherTileId)) {
      return true;
    }

    const specialTiles = [5, 7, 13];
    const leftKind = Tilemap.getAutotileKind(tileId);
    const rightKind = Tilemap.getAutotileKind(otherTileId);

    const leftSpecial = specialTiles.includes(leftKind);
    const rightSpecial = specialTiles.includes(rightKind);
    if (leftSpecial !== rightSpecial) {
      return true;
    }

    return false;
  }

  static getAutoTileShapeForPosition(x, y, z, tileId, skipPreview = true) {
    if (Tilemap.isWallSideTile(tileId) || Tilemap.isRoofTile(tileId)) {
      return this.getWallShapeForPosition(x, y, z, tileId, skipPreview);
    }

    if (Tilemap.isWaterfallTile(tileId)) {
      return this.getWaterfallShapeForPosition(x, y, z, tileId, skipPreview);
    }

    const a = this.isAutotileMatch(tileId, x -1, y -1, z, skipPreview);
    const b = this.isAutotileMatch(tileId, x, y -1, z, skipPreview);
    const c = this.isAutotileMatch(tileId, x +1, y -1, z, skipPreview);

    const d = this.isAutotileMatch(tileId, x -1, y, z, skipPreview);
    const e = this.isAutotileMatch(tileId, x +1, y, z, skipPreview);

    const f = this.isAutotileMatch(tileId, x -1, y +1, z, skipPreview);
    const g = this.isAutotileMatch(tileId, x, y +1, z, skipPreview);
    const h = this.isAutotileMatch(tileId, x +1, y +1, z, skipPreview);

    const config = [a, b, c, d, e, f, g, h];
    return this.getShapeForConfiguration(config);
  }

  static isShiftMapping() {
    if (Input.isPressed('shift')) {
      return true;
    }

    if (SceneManager._scene._mapEditorWindow._manualTileSelected !== undefined) {
      return true;
    }

    return false;
  }

  static changeAutoTileShapeForPosition(x, y, z, tileId, skipPreview = true) {
    if (z >= 4 || this.isShiftMapping()) {
      return tileId;
    }

    const shape = this.getAutoTileShapeForPosition(x, y, z, tileId, skipPreview);
    return Tilemap.TILE_ID_A1 + Math.floor((tileId - Tilemap.TILE_ID_A1) / 48) * 48 + shape;
  }

  static resetTileShape(x, y, z, previewOnly = false) {
    if (x < 0 || x >= $gameMap.width()) {
      return;
    }

    if (y < 0 || y >= $gameMap.height()) {
      return;
    }

    const tileId = this.getCurrentTileAtPosition(x, y, z, !previewOnly);
    if (Tilemap.isAutotile(tileId)) {
      const effectiveTileId = this.changeAutoTileShapeForPosition(x, y, z, tileId, !previewOnly);
      if (tileId !== effectiveTileId) {
        this.setMapTile(x, y, z, effectiveTileId, false, previewOnly);
      }
    }
  }

  static undoLastChange() {
    if (changeHistory.length === 0) {
      SoundManager.playBuzzer();
      return;
    }

    const lastChange = changeHistory.pop();
    currentChange = {};
    for (const tileIndex in lastChange) {
      currentChange[tileIndex] = $dataMap.data[tileIndex];
      $dataMap.data[tileIndex] = lastChange[tileIndex];
    }

    undoHistory.push(currentChange);
    currentChange = false;
    SceneManager._scene._mapEditorCommands.redraw();
    SceneManager._scene._mapEditorGrid.refresh();

    mapCaches[$gameMap._mapId] = $dataMap;
  }

  static redoLastUndoneChange() {
    if (undoHistory.length === 0) {
      SoundManager.playBuzzer();
      return;
    }

    const lastChange = undoHistory.pop();
    currentChange = {};
    for (const tileIndex in lastChange) {
      currentChange[tileIndex] = $dataMap.data[tileIndex];
      $dataMap.data[tileIndex] = lastChange[tileIndex];
    }

    this.logChange(false);
  }

  static logChange(clearUndo = true) {
    const hasChanges = Object.keys(currentChange).length > 0;

    if (hasChanges) {
      changeHistory.push(currentChange);
      if (clearUndo) {
        undoHistory = [];
      }
    }
    currentChange = false;

    while (changeHistory.length > 300) {
      changeHistory.shift();
    }

    SceneManager._scene._mapEditorCommands.redraw();
    SceneManager._scene._mapEditorGrid.refresh();

    mapCaches[$gameMap._mapId] = $dataMap;
  }

  static maybeUpdateTileNeighbors(x, y, z, expectedUpdate = true, previewOnly = false) {
    if (this.isShiftMapping()) {
      return;
    }

    if (!expectedUpdate) {
      return;
    }

    this.resetTileShape(x -1, y -1, z, previewOnly);
    this.resetTileShape(x, y -1, z, previewOnly);
    this.resetTileShape(x +1, y -1, z, previewOnly);

    this.resetTileShape(x -1, y, z, previewOnly);
    this.resetTileShape(x +1, y, z, previewOnly);

    this.resetTileShape(x -1, y +1, z, previewOnly);
    this.resetTileShape(x, y + 1, z, previewOnly);
    this.resetTileShape(x +1, y +1, z, previewOnly);
  }

  static getDefaultLayerForTileId(tileId) {
    if (!Tilemap.isAutotile(tileId)) {
      return 3;
    }

    if (tileId >= Tilemap.TILE_ID_A3) {
      return 0;
    }

    const kind = Tilemap.getAutotileKind(tileId);
    if (highLayerAutotiles.includes(kind)) {
      return 1;
    }

    return 0;
  }

  static getItemsToChange(x, y, z, tileId, skipPreview = true, updateHigherLayers = true) {
    if (z !== 7) {
      return [{
        x,
        y,
        z,
        tileId,
      }];
    }

    // When using automatic mode, we may need to change more than one layer at the same time
    const items = [];
    let layerId = this.getDefaultLayerForTileId(tileId);

    if (layerId === 1 && Tilemap.isTileA1(tileId)) {
      items.push({
        x,
        y,
        z: 0,
        tileId: Tilemap.TILE_ID_A1,
      });
    }

    if (layerId === 3) {
      // If there's already something on the fourth layer, then move it to the third and place the new tile on the 4th
      const currentTile = this.getCurrentTileAtPosition(x, y, 3, skipPreview);
      if (currentTile === tileId && tileId !== 0) {
        return [];
      }

      if (currentTile) {
        items.push({
          x,
          y,
          z: 2,
          tileId: currentTile,
        });
      }
    }

    items.push({
      x,
      y,
      z: layerId,
      tileId,
    });

    // Remove anything above the new tile
    if (updateHigherLayers) {
      for (let i = layerId + 1; i <= 3; i++) {
        items.push({
          x,
          y,
          z: i,
          tileId: 0,
        });
      }
    }

    return items;
  }

  static canEraseLayer(layerIndex) {
    if (currentTool === 'eraser') {
      return true;
    }

    if (layerIndex >= 2) {
      return true;
    }

    if (multiLayerSelection.length) {
      return true;
    }

    if (currentLayer !== Layers.auto) {
      return true;
    }

    // The lower layers can only be erased with the pen in auto mode when there are multiple layers selected
    return false;
  }

  static _eraseSingleMapTile(x, y, z, updateNeighbors = true, previewOnly = false) {
    for (let newZ = 0; newZ <= 3; newZ++) {
      if (newZ !== z && z !== Layers.auto) {
        continue;
      }

      if (!this.canEraseLayer(newZ)) {
        continue;
      }

      const tileIndex = this.tileIndex(x, y, newZ);
      if (previewOnly) {
        previewChanges[tileIndex] = 0;
      } else {
        const oldTile = $dataMap.data[tileIndex];
        if (currentChange[tileIndex] === undefined && oldTile !== 0) {
          currentChange[tileIndex] = oldTile;
        }

        $dataMap.data[tileIndex] = 0;
      }

      this.maybeUpdateTileNeighbors(x, y, z, updateNeighbors, previewOnly);
    }
  }

  static _applySingleMapTile(x, y, z, tileId, updateNeighbors = true, previewOnly = false) {
    if (!tileId) {
      this._eraseSingleMapTile(x, y, z, updateNeighbors, previewOnly);
      return;
    }

    const itemsToChange = this.getItemsToChange(x, y, z, tileId, !previewOnly, updateNeighbors);
    for (const {x, y, z, tileId} of itemsToChange) {
      if (z > 5) {
        continue;
      }
      const tileIndex = this.tileIndex(x, y, z);
      let effectiveTileId = tileId;
      if (Tilemap.isAutotile(tileId)) {
        effectiveTileId = this.changeAutoTileShapeForPosition(x, y, z, tileId, false);
      }

      if (previewOnly) {
        previewChanges[tileIndex] = effectiveTileId;
      } else {
        const oldTile = $dataMap.data[tileIndex];
        if (currentChange[tileIndex] === undefined && oldTile !== effectiveTileId) {
          currentChange[tileIndex] = oldTile;
        }

        $dataMap.data[tileIndex] = effectiveTileId;
      }

      this.maybeUpdateTileNeighbors(x, y, z, updateNeighbors, previewOnly);
    }
  }

  static setMapTile(x, y, z, tileId, updateNeighbors = true, previewOnly = false) {
    if (!$gameMap.isValid(x, y)) {
      return;
    }
    if (currentTool !== 'eraser') {
      if (tileId === undefined ) {
        return;
      }

      if (tileId === 0 && !this.canEraseLayer(z)) {
        return;
      }
    }

    this._applySingleMapTile(x, y, z, tileId, updateNeighbors, previewOnly);
  }

  static getSelectedTileIndex(col, row) {
    if (currentTool === 'eraser') {
      return;
    }

    if (currentTileId === undefined) {
      return;
    }

    if (selectedTileList.length < tileCols * tileRows) {
      return;
    }

    const realCol = col % tileCols;
    const realRow = row % tileRows;
    return realRow * tileCols + realCol;
  }

  static getSelectedTileCell(col, row) {
    const index = this.getSelectedTileIndex(col, row);
    if (index || index === 0) {
      return selectedTileList[index];
    }
  }

  static setSelectionTileMaybeMultiLayer(tileX, tileY, selectionCol, selectionRow, previewOnly = false) {
    const index = this.getSelectedTileIndex(selectionCol, selectionRow);

    if (currentLayer === 7 && multiLayerSelection.length) {
      for (let z = 0; z <= 3; z++) {
        const tileId = multiLayerSelection[z][index] ?? 0;
        this.setMapTile(tileX, tileY, z, tileId, true, previewOnly);
      }
    } else {
      const tileId = selectedTileList[index] ?? 0;
      this.setMapTile(tileX, tileY, currentLayer, tileId, true, previewOnly);
    }
  }

  static applyRectangle(startX, startY, width, height, previewOnly = false) {
    if (currentTileId === undefined && currentTool !== 'eraser') {
      return;
    }

    this.ensureLayerVisibility();
    let initialRow = 0;
    let initialCol = 0;
    let rowIncrement = 1;
    let colIncrement = 1;

    if (rectangleBackWidth > 0) {
      initialCol = width - 1;
      colIncrement *= -1;
    }

    if (rectangleBackHeight > 0) {
      initialRow = height - 1;
      rowIncrement *= -1;
    }

    let selectionRow = initialRow;
    let selectionCol = initialCol;

    if (previewOnly) {
      previewChanges = {};
    } else {
      currentChange = {};
    }

    for (let tileY = startY; tileY < startY + height; tileY++) {
      selectionCol = initialCol;
      for (let tileX = startX; tileX < startX + width; tileX++) {
        this.setSelectionTileMaybeMultiLayer(tileX, tileY, selectionCol, selectionRow, previewOnly);
        selectionCol += colIncrement;
      }
      selectionRow += rowIncrement;
    }

    if (previewOnly) {
      SceneManager._scene._spriteset._tilemap.refresh();
      this.maybeRefreshGrid();
    } else {
      this.logChange();
      this.refreshTilemap();
    }
  }

  static maybeRefreshGrid() {
    if (currentLayer !== 5) {
      return;
    }

    // Grid refresh is a heavy operation, so let's limit how often we do it
    if (!gridPreviewBlockHandler) {
      gridPreviewBlockHandler = setTimeout(() => {
        gridPreviewBlockHandler = false;
        if (gridNeedsRefresh) {
          setTimeout(() => {
            this.maybeRefreshGrid();
          }, 50);
        }
      }, 50);

      SceneManager._scene._mapEditorGrid.refresh();
      return;
    }

    gridNeedsRefresh = true;
  }

  static refreshTilemap() {
    previewChanges = {};
    SceneManager._scene._spriteset._tilemap.refresh();
    SceneManager._scene._mapEditorGrid.refresh();
  }

  static copyAutoRectangle(startX, startY, width, height) {
    let index = 0;
    for (let z = 0; z <= 3; z++) {
      multiLayerSelection[z] = Array(width * height);
    }

    for (let tileY = startY; tileY < startY + height; tileY++) {
      for (let tileX = startX; tileX < startX + width; tileX++) {
        for (let z = 0; z <= 3; z++) {
          const tileIndex = this.tileIndex(tileX, tileY, z);
          multiLayerSelection[z][index] = $dataMap.data[tileIndex] || 0;
          selectedTileList[index] = $dataMap.data[tileIndex] || selectedTileList[index] || 0;
          if (currentTileId === undefined) {
            currentTileId = selectedTileList[index];
          }
        }
        index++;
      }
    }
  }

  static _selectTileIfNoneSelectedYet(tileId) {
    if (currentTileId === undefined) {
      currentTileId = tileId;
    }
  }

  static _shouldSkipRemainingLayersCopy(foundAny, z) {
    if (!foundAny) {
      return false;
    }

    if (Input.isPressed('control')) {
      return z !== 3;
    }

    return true;
  }

  static copyHigherAutoRectangle(startX, startY, width, height) {
    for (let z = 0; z <= 3; z++) {
      multiLayerSelection[z] = Array(width * height);
    }

    let foundAny = false;
    for (let z = 3; z >= 0; z--) {
      let index = 0;
      for (let tileY = startY; tileY < startY + height; tileY++) {
        for (let tileX = startX; tileX < startX + width; tileX++) {
          const tileIndex = this.tileIndex(tileX, tileY, z);
          multiLayerSelection[z][index] = $dataMap.data[tileIndex] || 0;
          selectedTileList[index] = $dataMap.data[tileIndex] || selectedTileList[index] || 0;
          this._selectTileIfNoneSelectedYet(selectedTileList[index]);
          if ($dataMap.data[tileIndex]) {
            foundAny = true;
          }

          index++;
        }
      }

      if (this._shouldSkipRemainingLayersCopy(foundAny, z)) {
        return;
      }
    }
  }

  static copyHigherRectangle(startX, startY, width, height) {
    let foundAny = false;

    for (let z = 3; z >= 0; z--) {
      let index = 0;

      for (let tileY = startY; tileY < startY + height; tileY++) {
        for (let tileX = startX; tileX < startX + width; tileX++) {
          const tileIndex = this.tileIndex(tileX, tileY, z);
          selectedTileList[index] = selectedTileList[index] || $dataMap.data[tileIndex] || 0;
          this._selectTileIfNoneSelectedYet(selectedTileList[index]);
          if ($dataMap.data[tileIndex]) {
            foundAny = true;
          }

          index++;
        }
      }

      if (this._shouldSkipRemainingLayersCopy(foundAny, z)) {
        return;
      }
    }
  }

  static copyManualRectangle(startX, startY, width, height) {
    let index = 0;

    for (let tileY = startY; tileY < startY + height; tileY++) {
      for (let tileX = startX; tileX < startX + width; tileX++) {
        const tileIndex = this.tileIndex(tileX, tileY, currentLayer);
        selectedTileList[index] = $dataMap.data[tileIndex] || 0;
        this._selectTileIfNoneSelectedYet(selectedTileList[index]);
        index++;
      }
    }
  }

  static copyRectangle(startX, startY, width, height) {
    if (!wasRightButtonDown) {
      return;
    }

    multiLayerSelection = [];
    selectedTileList = Array(width * height);
    currentTileId = undefined;

    if (currentLayer === 7) {
      if (Input.isPressed('shift')) {
        this.copyHigherAutoRectangle(startX, startY, width, height);
      } else {
        this.copyAutoRectangle(startX, startY, width, height);
      }
    } else if (Input.isPressed('shift')) {
      this.copyHigherRectangle(startX, startY, width, height);
    } else {
      this.copyManualRectangle(startX, startY, width, height);
    }

    tileCols = width;
    tileRows = height;
    messySelection = true;

    if (currentTool == 'eraser') {
      this.restoreLastDrawingTool();
    }

    this.refreshTilemap();
    SceneManager._scene._mapEditorWindow._manualTileSelected = undefined;
    SceneManager._scene._mapEditorWindow.refresh();
    SceneManager._scene._mapEditorWindow.ensureSelectionVisible();
  }

  static restoreLastDrawingTool() {
    if (lastDrawingTool === 'rectangle') {
      this.rectangleButton();
    } else {
      this.pencilButton();
    }
  }

  static isSameKindTileCurrentLayer(layers, index) {
    const size = $gameMap.width() * $gameMap.height();

    if (currentLayer > 3) {
      for (let z = 0; z <= 3; z++) {
        const tileId = $dataMap.data[index + z * size];
        if (!Tilemap.isSameKindTile(tileId, layers[z])) {
          return false;
        }
      }

      return true;
    }

    const tileId = $dataMap.data[index];
    return Tilemap.isSameKindTile(layers[currentLayer], tileId);
  }

  static _maybeValidateTileIndexForCollectionList(list, index, area, initialTileIds) {
    if (area[index] !== undefined) {
      return;
    }

    const height = $gameMap.height();
    const width = $gameMap.width();

    area[index] = this.isSameKindTileCurrentLayer(initialTileIds, index);

    if (!area[index]) {
      return;
    }

    const workLayer = currentLayer <= 3 ? currentLayer : 0;

    const y = this.indexPositionY(index, workLayer);
    const x = index - this.tileIndex(0, y, workLayer);

    const leftIndex = x > 0 ? this.tileIndex(x - 1, y, workLayer) : -1;
    const rightIndex = x < width -1 ? this.tileIndex(x + 1, y, workLayer) : -1;
    const upIndex = y > 0 ? this.tileIndex(x, y - 1, workLayer) : -1;
    const downIndex = y < height - 1 ? this.tileIndex(x, y + 1, workLayer) : -1;

    const maybeAddIndex = (index) => {
      if (index >= 0 && !list.includes(index)) {
        list.push(index);
      }
    };

    maybeAddIndex(leftIndex);
    maybeAddIndex(rightIndex);
    maybeAddIndex(upIndex);
    maybeAddIndex(downIndex);
  }

  static collectFillAreaFrom(mapX, mapY) {
    const list = [];
    const initialTileIds = [];

    const area = {};
    for (let z = 0; z <= 3; z++) {
      const tileIndex = this.tileIndex(mapX, mapY, z);

      initialTileIds[z] = $dataMap.data[tileIndex];
      if (z === currentLayer || (currentLayer === 7 && z === 0)) {
        list.push(tileIndex);
      }
    }

    for (let i = 0; i < list.length; i++) {
      const index = list[i];
      this._maybeValidateTileIndexForCollectionList(list, index, area, initialTileIds);
    }

    return Object.keys(area).filter(key => area[key]);
  }

  static applyFillArea(mapX, mapY) {
    if (currentTileId === undefined) {
      return;
    }

    this.ensureLayerVisibility();
    const affectedArea = this.collectFillAreaFrom(mapX, mapY);
    const height = $gameMap.height();
    const width = $gameMap.width();
    const workLayer = currentLayer <= 3 ? currentLayer : 0;

    currentChange = {};
    for (const tileIndex of affectedArea) {
      const y = this.indexPositionY(tileIndex, workLayer);
      const x = tileIndex - this.tileIndex(0, y, workLayer);

      const xDiff = (x + width - mapX) % tileCols;
      const yDiff = (y + height - mapY) % tileRows;

      this.setSelectionTileMaybeMultiLayer(x, y, xDiff, yDiff, false);
    }

    this.logChange();
    this.refreshTilemap();
  }

  static ensureLayerVisibility() {
    if (!layerVisibility[currentLayer]) {
      layerVisibility[currentLayer] = true;

      if (SceneManager._scene instanceof Scene_Map) {
        SceneManager._scene._mapEditorLayerListWindow.refresh();
      }
    }
  }

  static applySelectedTiles(mapX, mapY) {
    if (currentTileId === undefined) {
      return;
    }

    if (selectedTileList.length < tileCols * tileRows) {
      return;
    }

    this.ensureLayerVisibility();
    let index = 0;
    for (let y = mapY; y < mapY + tileRows; y++) {
      for (let x = mapX; x < mapX + tileCols; x++) {
        if (!$gameMap.isValid(x, y)) {
          continue;
        }

        if (currentLayer === 7 && multiLayerSelection.length) {
          for (let z = 0; z <= 3; z++) {
            this.setMapTile(x, y, z, multiLayerSelection[z][index]);
          }
        } else {
          this.setMapTile(x, y, currentLayer, selectedTileList[index]);
        }

        index++;
      }
    }

    this.refreshTilemap();
  }

  static updateRightTouch(x, y) {
    if (CycloneMapEditor$1.isRightButtonDown) {
      if (!CycloneMapEditor$1.wasRightButtonDown) {
        CycloneMapEditor$1.rectangleStartX = x;
        CycloneMapEditor$1.rectangleStartY = y;
        CycloneMapEditor$1.rectangleStartMouseX = TouchInput.x;
        CycloneMapEditor$1.rectangleStartMouseY = TouchInput.y;
      }

      CycloneMapEditor$1.rectangleWidth = (x - CycloneMapEditor$1.rectangleStartX + 1).clamp(0, 30);
      CycloneMapEditor$1.rectangleHeight = (y - CycloneMapEditor$1.rectangleStartY + 1).clamp(0, 30);
      CycloneMapEditor$1.rectangleBackWidth = (CycloneMapEditor$1.rectangleStartX - x).clamp(0, 30);
      CycloneMapEditor$1.rectangleBackHeight = (CycloneMapEditor$1.rectangleStartY - y).clamp(0, 30);

      if (this.crossedHorizontalLoop()) {
        // moved right through the edge, limit the width to it
        if (CycloneMapEditor$1.rectangleStartX > x) {
          CycloneMapEditor$1.rectangleWidth = $gameMap.width() - CycloneMapEditor$1.rectangleStartX;
          CycloneMapEditor$1.rectangleBackWidth = 0;
        } else if (x > CycloneMapEditor$1.rectangleStartX) {
          CycloneMapEditor$1.rectangleBackWidth = CycloneMapEditor$1.rectangleStartX;
          CycloneMapEditor$1.rectangleWidth = 0;
        }
      }

      if (this.crossedVerticalLoop()) {
        if (CycloneMapEditor$1.rectangleStartY > y) {
          CycloneMapEditor$1.rectangleHeight = $gameMap.height() - CycloneMapEditor$1.rectangleStartY;
          CycloneMapEditor$1.rectangleBackHeight = 0;
        } else if (y > CycloneMapEditor$1.rectangleStartY) {
          CycloneMapEditor$1.rectangleBackHeight = CycloneMapEditor$1.rectangleStartY;
          CycloneMapEditor$1.rectangleHeight = 0;
        }
      }
      SceneManager._scene._spriteset._mapEditorCursor.updateDrawing();
      return;
    }

    if (CycloneMapEditor$1.wasRightButtonDown) {
      this.updateRectangleReleased();
      return;
    }
  }

  static updateCurrentToolTouch(x, y) {
    switch(CycloneMapEditor$1.currentTool) {
      case 'fill':
        this.updateFill(x, y);
        break;
      case 'pencil':
        this.updatePencil(x, y);
        break;
      case 'rectangle':
        this.updateRectangle(x, y);
        break;
      case 'eraser':
        this.updateEraser(x, y);
        break;
    }
  }

  static changeRectangleArea(previewOnly = false) {
    let startX = CycloneMapEditor$1.rectangleStartX;
    let startY = CycloneMapEditor$1.rectangleStartY;
    let applyWidth = 0;
    let applyHeight = 0;

    if (CycloneMapEditor$1.rectangleWidth > 0) {
      applyWidth = CycloneMapEditor$1.rectangleWidth;
    } else if (CycloneMapEditor$1.rectangleBackWidth > 0) {
      startX -= CycloneMapEditor$1.rectangleBackWidth;
      applyWidth = CycloneMapEditor$1.rectangleBackWidth +1;
    }

    if (CycloneMapEditor$1.rectangleHeight > 0) {
      applyHeight = CycloneMapEditor$1.rectangleHeight;
    } else if (CycloneMapEditor$1.rectangleBackHeight > 0) {
      startY -= CycloneMapEditor$1.rectangleBackHeight;
      applyHeight = CycloneMapEditor$1.rectangleBackHeight + 1;
    }

    if (applyWidth > 0 && applyHeight > 0) {
      if (CycloneMapEditor$1.wasRightButtonDown) {
        if (!previewOnly) {
          CycloneMapEditor$1.copyRectangle(startX, startY, applyWidth, applyHeight);
        }
      } else {
        CycloneMapEditor$1.applyRectangle(startX, startY, applyWidth, applyHeight, previewOnly);
      }
    }
  }

  static updateRectangleReleased() {
    this.changeRectangleArea();

    CycloneMapEditor$1.rectangleWidth = 0;
    CycloneMapEditor$1.rectangleHeight = 0;
    CycloneMapEditor$1.rectangleBackWidth = 0;
    CycloneMapEditor$1.rectangleBackHeight = 0;
    SceneManager._scene._spriteset._mapEditorCursor.updateDrawing();
  }

  static crossedHorizontalLoop() {
    if (!$gameMap.isLoopHorizontal()) {
      return false;
    }

    // if moved left but the end position is to the right
    if ((CycloneMapEditor$1.rectangleStartMouseX > TouchInput.x && CycloneMapEditor$1.rectangleWidth > 0) ) {
      return true;
    }

    if ((CycloneMapEditor$1.rectangleStartMouseX < TouchInput.x && CycloneMapEditor$1.rectangleBackWidth > 0)) {
      return true;
    }

    return false;
  }

  static crossedVerticalLoop() {
    if (!$gameMap.isLoopVertical()) {
      return false;
    }

    if ((CycloneMapEditor$1.rectangleStartMouseY > TouchInput.y && CycloneMapEditor$1.rectangleHeight > 0)) {
      return true;
    }

    if ((CycloneMapEditor$1.rectangleStartMouseY < TouchInput.y && CycloneMapEditor$1.rectangleBackHeight > 0)) {
      return true;
    }

    return false;
  }

  static updateRectangle(x, y) {
    if (TouchInput.isPressed()) {
      if (!wasPressing) {
        CycloneMapEditor$1.rectangleStartX = x;
        CycloneMapEditor$1.rectangleStartY = y;
        CycloneMapEditor$1.rectangleStartMouseX = TouchInput.x;
        CycloneMapEditor$1.rectangleStartMouseY = TouchInput.y;
      }

      CycloneMapEditor$1.rectangleWidth = (x - CycloneMapEditor$1.rectangleStartX + 1).clamp(0, 30);
      CycloneMapEditor$1.rectangleHeight = (y - CycloneMapEditor$1.rectangleStartY + 1).clamp(0, 30);
      CycloneMapEditor$1.rectangleBackWidth = (CycloneMapEditor$1.rectangleStartX - x).clamp(0, 30);
      CycloneMapEditor$1.rectangleBackHeight = (CycloneMapEditor$1.rectangleStartY - y).clamp(0, 30);

      if (this.crossedHorizontalLoop()) {
        // moved right through the edge, limit the width to it
        if (CycloneMapEditor$1.rectangleStartX > x) {
          CycloneMapEditor$1.rectangleWidth = $gameMap.width() - CycloneMapEditor$1.rectangleStartX;
          CycloneMapEditor$1.rectangleBackWidth = 0;
        } else if (x > CycloneMapEditor$1.rectangleStartX) {
          CycloneMapEditor$1.rectangleBackWidth = CycloneMapEditor$1.rectangleStartX;
          CycloneMapEditor$1.rectangleWidth = 0;
        }
      }

      if (this.crossedVerticalLoop()) {
        if (CycloneMapEditor$1.rectangleStartY > y) {
          CycloneMapEditor$1.rectangleHeight = $gameMap.height() - CycloneMapEditor$1.rectangleStartY;
          CycloneMapEditor$1.rectangleBackHeight = 0;
        } else if (y > CycloneMapEditor$1.rectangleStartY) {
          CycloneMapEditor$1.rectangleBackHeight = CycloneMapEditor$1.rectangleStartY;
          CycloneMapEditor$1.rectangleHeight = 0;
        }
      }

      this.changeRectangleArea(true);
      SceneManager._scene._spriteset._mapEditorCursor.updateDrawing();
      return;
    }

    if (wasPressing) {
      this.updateRectangleReleased();
      return;
    }
  }

  static updateFill(x, y) {
    if (!TouchInput.isPressed() || wasPressing) {
      return;
    }

    CycloneMapEditor$1.applyFillArea(x, y);
  }

  static updateEraser(x, y) {
    this.updateRectangle(x, y);
  }

  static updatePencil(x, y) {
    if (TouchInput.isPressed()) {
      if (!currentChange) {
        currentChange = {};
      }

      CycloneMapEditor$1.applySelectedTiles(x, y);
      return;
    }

    if (wasPressing) {
      CycloneMapEditor$1.logChange();
    }
  }
}

globalThis.CycloneMapEditor = CycloneMapEditor$1;
CycloneMapEditor$1.register();

const regionColors = [
  '#e75858',
  '#c0986f',
  '#cbcf32',
  '#8ab24c',
  '#22aa47',
  '#1cbf97',
  '#7ec1df',
  '#4da4dc',
  '#4f36a9',
  '#725fb9',
  '#d48de4',
  '#fa5e84'
];

CycloneMapEditor.patchClass(Bitmap, $super => class {
  drawNormalTile(tileId, x, y, drawWidth, drawHeight) {
    if (tileId === undefined) {
      return;
    }

    const bitmap =  CycloneMapEditor.loadTilesetBitmap(tileId);

    const sourceX = ((Math.floor(tileId / 128) % 2) * 8 + (tileId % 8)) * CycloneMapEditor.tileWidth;
    const sourceY = (Math.floor((tileId % 256) / 8) % 16) * CycloneMapEditor.tileHeight;

    this.blt(bitmap, sourceX, sourceY, CycloneMapEditor.tileWidth, CycloneMapEditor.tileHeight, x, y, drawWidth ?? CycloneMapEditor.tileWidth, drawHeight ?? CycloneMapEditor.tileHeight);
    return bitmap;
  }

  drawAutoTileTable(bitmap, table, tileX, tileY, x, y, drawWidth, drawHeight) {
    const halfWidth = CycloneMapEditor.tileWidth / 2;
    const halfHeight = CycloneMapEditor.tileHeight / 2;
    const drawHalfWidth = (drawWidth ?? CycloneMapEditor.tileWidth) / 2;
    const drawHalfHeight = (drawHeight ?? CycloneMapEditor.tileHeight) / 2;

    for (let i = 0; i < 4; i++) {
      const tableX = table[i][0];
      const tableY = table[i][1];

      const sourceX = (tileX * CycloneMapEditor.tileWidth) + (tableX * halfWidth);
      const sourceY = (tileY * CycloneMapEditor.tileHeight) + (tableY * halfHeight);
      const targetX = x + (i % 2) * halfWidth;
      const targetY = y + Math.floor(i / 2) * halfHeight;

      this.blt(bitmap, sourceX, sourceY, halfWidth, halfHeight, targetX, targetY, drawHalfWidth, drawHalfHeight);
    }

    return bitmap;
  }

  drawTileA1(bitmap, tileId, x, y, drawWidth, drawHeight) {
    let tileX = 0;
    let tileY = 0;
    let autotileTable = Tilemap.FLOOR_AUTOTILE_TABLE;
    const kind = Tilemap.getAutotileKind(tileId);
    const shape = Tilemap.getAutotileShape(tileId);

    switch(kind) {
      case 0:
        tileX = 0;
        tileY = 0;
        break;
      case 1:
        tileX = 0;
        tileY = 3;
        break;
      case 2:
        tileX = 6;
        tileY = 0;
        break;
      case 3:
        tileX = 6;
        tileY = 3;
        break;
      default:
        tileX = Math.floor((kind % 8) / 4) * 8;
        tileY = Math.floor(kind / 8) * 6 + (Math.floor((kind % 8) / 2) % 2) * 3;

        if (kind % 2 === 1) {
          tileX += 6;
          autotileTable = Tilemap.WATERFALL_AUTOTILE_TABLE;
        }
        break;
    }

    return this.drawAutoTileTable(bitmap, autotileTable[shape], tileX, tileY, x, y, drawWidth, drawHeight);
  }

  drawTileA2(bitmap, tileId, x, y, drawWidth, drawHeight) {
    const kind = Tilemap.getAutotileKind(tileId);
    const tileX = (kind % 8) * 2;
    const tileY = (Math.floor(kind / 8) - 2) * 3;
    const shape = Tilemap.getAutotileShape(tileId);

    return this.drawAutoTileTable(bitmap, Tilemap.FLOOR_AUTOTILE_TABLE[shape], tileX, tileY, x, y, drawWidth, drawHeight);
  }

  drawTileA3(bitmap, tileId, x, y, drawWidth, drawHeight) {
    const kind = Tilemap.getAutotileKind(tileId);
    const tileX = (kind % 8) * 2;
    const tileY = (Math.floor(kind / 8) - 6) * 2;
    const shape = Tilemap.getAutotileShape(tileId);

    return this.drawAutoTileTable(bitmap, Tilemap.WALL_AUTOTILE_TABLE[shape], tileX, tileY, x, y, drawWidth, drawHeight);
  }

  drawTileA4(bitmap, tileId, x, y, drawWidth, drawHeight) {
    const kind = Tilemap.getAutotileKind(tileId);
    const tileX = (kind % 8) * 2;
    const tileY = Math.floor((Math.floor(kind / 8) - 10) * 2.5 + (Math.floor(kind / 8) % 2 === 1 ? 0.5 : 0));
    const shape = Tilemap.getAutotileShape(tileId);
    let autotileTable = Tilemap.FLOOR_AUTOTILE_TABLE;

    if (Math.floor(kind / 8) % 2 === 1) {
      autotileTable = Tilemap.WALL_AUTOTILE_TABLE;
    }

    return this.drawAutoTileTable(bitmap, autotileTable[shape], tileX, tileY, x, y, drawWidth, drawHeight);
  }

  drawAutoTile(tileId, x, y, drawWidth, drawHeight) {
    const bitmap =  CycloneMapEditor.loadTilesetBitmap(tileId);

    if (Tilemap.isTileA1(tileId)) {
      return this.drawTileA1(bitmap, tileId, x, y, drawWidth, drawHeight);
    }

    if (Tilemap.isTileA2(tileId)) {
      return this.drawTileA2(bitmap, tileId, x, y, drawWidth, drawHeight);
    }

    if (Tilemap.isTileA3(tileId)) {
      return this.drawTileA3(bitmap, tileId, x, y, drawWidth, drawHeight);
    }

    if (Tilemap.isTileA4(tileId)) {
      return this.drawTileA4(bitmap, tileId, x, y, drawWidth, drawHeight);
    }
  }

  drawTile(tileId, x, y, drawWidth, drawHeight) {
    if (tileId <= 0) {
      return;
    }

    if (tileId >= Tilemap.TILE_ID_A1) {
      return this.drawAutoTile(tileId, x, y, drawWidth, drawHeight);
    }

    return this.drawNormalTile(tileId, x, y, drawWidth, drawHeight);
  }

  drawIcon(iconIndex, x, y) {
    const bitmap = ImageManager.loadSystem('IconSet');
    const pw = ImageManager.iconWidth;
    const ph = ImageManager.iconHeight;
    const sx = (iconIndex % 16) * pw;
    const sy = Math.floor(iconIndex / 16) * ph;
    this.blt(bitmap, sx, sy, pw, ph, x, y);
  }

  drawRegion(regionId, x, y, drawWidth, drawHeight) {
    const realDrawWidth = drawWidth ?? CycloneMapEditor.tileWidth;
    const realDrawHeight = drawHeight ?? CycloneMapEditor.tileHeight;

    if (regionId > 0) {
      const color = regionColors[regionId % regionColors.length];
      this.fillRect(x, y, realDrawWidth, realDrawHeight, `${ color}66`);
    }

    let iconIndex = CycloneMapEditor.regionIcons.get(regionId) ?? 0;
    if (iconIndex) {
      const {iconWidth, iconHeight} = ImageManager;
      const diffX = (realDrawWidth - iconWidth) / 2;
      const diffY = (realDrawHeight - iconHeight) / 2;

      this.drawIcon(iconIndex, x + diffX, y + diffY);
    } else {
      this.drawText(regionId, x, y, realDrawWidth, realDrawHeight, 'center');
    }
  }

  drawShadow(shadowId, x, y, drawWidth, drawHeight) {
    const halfWidth = (drawWidth ?? CycloneMapEditor.tileWidth) / 2;
    const halfHeight = (drawHeight ?? CycloneMapEditor.tileHeight) / 2;

    if (shadowId <= 0 || shadowId > 15) {
      return;
    }

    const table = shadowId.toString(2).padZero(4);
    for (let i = 0; i < 4; i++) {
      if (table[3 - i] !== '1') {
        continue;
      }

      const drawX = x + (i % 2) * halfWidth;
      const drawY = y + Math.floor(i / 2) * halfHeight;

      this.fillRect(drawX, drawY, halfWidth, halfHeight, '#00000066');
    }
  }
});

CycloneMapEditor.patchClass(DataManager, $super => class {
  static loadMapData(mapId) {
    if (mapId > 0 && CycloneMapEditor.mapCaches[mapId]) {
      globalThis.$dataMap = CycloneMapEditor.mapCaches[mapId];
      this.onLoad('$dataMap');
      return;
    }

    return $super.loadMapData.call(this, mapId);
  }
});

CycloneMapEditor.patchClass(Game_Map, $super => class {
  screenTileX() {
    if (!CycloneMapEditor.active) {
      return $super.screenTileX.call(this);
    }

    return (Graphics.width - CycloneMapEditor.windowWidth) / this.tileWidth();
  }

  screenTileY() {
    if (!CycloneMapEditor.active) {
      return $super.screenTileY.call(this);
    }

    return (Graphics.height - 40) / this.tileHeight();
  }

  regionId(x, y) {
    if (CycloneMapEditor.active) {
      return CycloneMapEditor.getCurrentTileAtPosition(x, y, 5, false);
    }

    return $super.regionId.call(this, x, y);
  }

  isLoopHorizontal() {
    if (CycloneMapEditor.active) {
      return false;
    }

    return $super.isLoopHorizontal.call(this);
  }

  isLoopVertical() {
    if (CycloneMapEditor.active) {
      return false;
    }

    return $super.isLoopVertical.call(this);
  }

  // canvasToMapX(x) {
  //   if (!CycloneMapEditor.active || CycloneMapEditor.currentZoom === 1) {
  //     return $super.canvasToMapX.call(this, x);
  //   }

  //   const tileWidth = this.tileWidth() * CycloneMapEditor.currentZoom;
  //   const originX = this._displayX * tileWidth;
  //   const mapX = Math.floor((originX + x) / tileWidth);
  //   return this.roundX(mapX);
  // }

  // canvasToMapY(y) {
  //   if (!CycloneMapEditor.active || CycloneMapEditor.currentZoom === 1) {
  //     return $super.canvasToMapY.call(this, y);
  //   }

  //   const tileHeight = this.tileHeight() * CycloneMapEditor.currentZoom;
  //   const originY = this._displayY * tileHeight;
  //   const mapY = Math.floor((originY + y) / tileHeight);
  //   return this.roundY(mapY);
  // }
});

CycloneMapEditor.patchClass(Game_Player, $super => class {
  centerX() {
    if (!CycloneMapEditor.active) {
      return $super.centerX.call(this);
    }

    return ((Graphics.width - CycloneMapEditor.windowWidth) / $gameMap.tileWidth() - 1) / 2.0;
  }

  centerY() {
    if (!CycloneMapEditor.active) {
      return $super.centerY.call(this);
    }

    return ((Graphics.height - 40) / $gameMap.tileHeight() - 1) / 2.0;
  }

  reserveTransfer(mapId, ...args) {
    if (CycloneMapEditor.changeHistory.length > 0) {
      if (confirm('Do you want to save your map before teleporting away?')) {
        CycloneMapEditor._doSave();
      }
    }

    $super.reserveTransfer.call(this, mapId, ...args);
  }

  executeEncounter() {
    const result = $super.executeEncounter.call(this);

    if (result) {
      if (CycloneMapEditor.changeHistory.length > 0) {
        if (confirm('Do you want to save your map before the battle starts?')) {
          CycloneMapEditor._doSave();
        }
      }
    }

    return result;
  }
});

class WindowCycloneGrid extends Window_Base {
  initialize() {
    const width = Graphics.width;
    const height = Graphics.height;
    const rect = new Rectangle(0, 0, width, height);

    super.initialize(rect);

    this.padding = 0;
    this.refresh();
    this.opacity = 0;

    this.backOpacity = 0;
    this.hide();
    this.deactivate();
  }

  createContents() {
    this._padding = 0;
    super.createContents();
  }

  drawCellGrid(x, y) {
    if (!CycloneMapEditor.showGrid) {
      return;
    }

    const drawWidth = Math.floor(CycloneMapEditor.tileWidth * CycloneMapEditor.currentZoom);
    const drawHeight = Math.floor(CycloneMapEditor.tileHeight * CycloneMapEditor.currentZoom);

    const padding = this.padding;
    const context = this.contents.context;
    context.save();
    context.strokeStyle = '#000000';
    context.beginPath();
    context.moveTo(x - padding, y - padding);
    context.lineTo(x - padding + drawWidth, y - padding);
    context.stroke();
    context.beginPath();
    context.moveTo(x - padding, y - padding);
    context.lineTo(x - padding, y - padding + drawHeight);
    context.stroke();
  }

  maybeDrawRegions(x, y) {
    if (!CycloneMapEditor.isLayerVisible(Layers.regions)) {
      return;
    }

    if (CycloneMapEditor.isLayerVisible(Layers.tags)) {
      return;
    }

    const mapX = $gameMap.canvasToMapX(x);
    const mapY = $gameMap.canvasToMapY(y);

    const regionId = $gameMap.regionId(mapX, mapY);
    if (regionId > 0) {
      this.contents.drawRegion(regionId, x, y);
    }
  }

  maybeDrawCollisions(x, y) {
    if (!CycloneMapEditor.isLayerVisible(Layers.collisions)) {
      return;
    }

    const mapX = $gameMap.canvasToMapX(x);
    const mapY = $gameMap.canvasToMapY(y);
    const drawWidth = CycloneMapEditor.tileWidth;
    const drawHeight = CycloneMapEditor.tileHeight;

    const downBlocked = !$gameMap.isPassable(mapX, mapY, 2);
    const upBlocked = !$gameMap.isPassable(mapX, mapY, 8);
    const leftBlocked = !$gameMap.isPassable(mapX, mapY, 4);
    const rightBlocked = !$gameMap.isPassable(mapX, mapY, 6);

    if (downBlocked && upBlocked && leftBlocked && rightBlocked) {
      this.contents.fillRect(x, y, drawWidth, drawHeight, '#FF000066');
      return;
    }

    const pieceHeight = Math.floor(drawHeight / 4);
    const pieceWidth = Math.floor(drawWidth / 4);

    if (downBlocked) {
      this.contents.fillRect(x, y + drawHeight - pieceHeight, drawWidth, pieceHeight, '#FF0000AA');
    }
    if (upBlocked) {
      this.contents.fillRect(x, y, drawWidth, pieceHeight, '#FF0000AA');
    }
    if (leftBlocked) {
      this.contents.fillRect(x, y, pieceWidth, drawHeight, '#FF0000AA');
    }
    if (rightBlocked) {
      this.contents.fillRect(x + drawWidth - pieceWidth, y, pieceWidth, drawHeight, '#FF0000AA');
    }
  }

  maybeDrawTags(x, y) {
    if (!CycloneMapEditor.isLayerVisible(Layers.tags)) {
      return;
    }

    const mapX = $gameMap.canvasToMapX(x);
    const mapY = $gameMap.canvasToMapY(y);

    const terrainTag = $gameMap.terrainTag(mapX, mapY);
    if (terrainTag === 0) {
      return;
    }

    const drawWidth = CycloneMapEditor.tileWidth;
    const drawHeight = CycloneMapEditor.tileHeight;

    this.contents.drawText(terrainTag, x, y, drawWidth, drawHeight, 'center');
  }

  drawCell(x, y) {
    this.drawCellGrid(x, y);

    this.maybeDrawRegions(x, y);
    this.maybeDrawCollisions(x, y);
    this.maybeDrawTags(x, y);
  }

  refresh() {
    this.contents.clear();

    this._lastDisplayX = $gameMap._displayX;
    this._lastDisplayY = $gameMap._displayY;

    const drawWidth = Math.floor(CycloneMapEditor.tileWidth * CycloneMapEditor.currentZoom);
    const drawHeight = Math.floor(CycloneMapEditor.tileHeight * CycloneMapEditor.currentZoom);

    let paddingX;
    let paddingY;

    if ($gameMap._displayX < 0) {
      paddingX = $gameMap._displayX * CycloneMapEditor.tileWidth;
    } else {
      paddingX = ($gameMap._displayX - Math.floor($gameMap._displayX)) * drawWidth;
    }

    if ($gameMap._displayY < 0) {
      paddingY = $gameMap._displayY * CycloneMapEditor.tileHeight;
    } else {
      paddingY = ($gameMap._displayY - Math.floor($gameMap._displayY)) * drawHeight;
    }

    const mapStartX = 0 - paddingX;
    const mapStartY = 0 - paddingY;
    const mapEndX = mapStartX + ($gameMap.width() * drawWidth);
    const mapEndY = mapStartY + ($gameMap.height() * drawHeight);

    const rightPos = Math.min(Graphics.width, mapEndX);
    let bottomPos = Math.min(Graphics.height, mapEndY);

    for (let x = mapStartX; x < rightPos; x += drawWidth) {
      if (x + drawWidth < 0) {
        continue;
      }

      for (let y = mapStartY; y < bottomPos; y += drawHeight) {
        if (y + drawHeight < 0) {
          continue;
        }

        this.drawCell(x, y);
      }
    }
  }

  update() {
    if (!CycloneMapEditor.active) {
      return;
    }

    if (this._lastDisplayX !== $gameMap._displayX || this._lastDisplayY !== $gameMap._displayY) {
      this.refresh();
    }
  }
}

const pencilIcon = new Image();
pencilIcon.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9bpUUqgmYo4pChdbIgKuIoVSyChdJWaNXB5NIvaGJIUlwcBdeCgx+LVQcXZ10dXAVB8APEydFJ0UVK/F9SaBHjwXE/3t173L0D/M0aU82ecUDVLCOTTIj5wooYfEUIEQgYRExipp7KLuTgOb7u4ePrXZxneZ/7c/QrRZMBPpF4lumGRbxOPL1p6Zz3iQVWkRTic+Ixgy5I/Mh12eU3zmWH/TxTMHKZOWKBWCx3sdzFrGKoxFPEUUXVKN+fd1nhvMVZrdVZ+578heGitpzlOs0RJLGIFNIQIaOOKmqwEKdVI8VEhvYTHv5hx58ml0yuKhg55rEBFZLjB/+D392apckJNymcAHpfbPsjBgR3gVbDtr+Pbbt1AgSegSut499oAjOfpDc6WvQIGNgGLq47mrwHXO4AkSddMiRHCtD0l0rA+xl9UwEYugX6Vt3e2vs4fQBy1NXSDXBwCIyWKXvN492h7t7+PdPu7weVs3K1THf6MgAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+QIGBQUOhdRws4AAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAABGElEQVRIx9XUIW/CQBiA4ZcFwRQhkEEysEdSNAoFPwKBmcXO4FBTwxB+Av8BDQo1PQi1sGSChKBGMsHUkR7XMnpfQ8KnWvO8vVzv4N4nJQV+Doejfn7MZCwvLcVbShnv55G0FB88P+E1agC0lLIiDyL8NUe5n2cx/wRg0m6eIs4BA6+WAIyInko2e4wdCMMBNqtvaP9akVh7cBEHytUSna8lU99HFYvxftOr8K6Jr/f71FUBCf5vQIpfDCSBRwaSwkMDSeLWOdB4/6VJb7gT45EHreDVGb336HSXItwIBL9ej16JKx66goJXB2C7+DhFXHFjk4N3u17F23gG4IxHBvRMfR/AGbd+0+A9HoRd8dBzoO9xKXyz+QMErgZJQZj0xAAAAABJRU5ErkJggg==';

const lineIcon = new Image();
lineIcon.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9bpUUqgmYo4pChdbIgKuIoVSyChdJWaNXB5NIvaGJIUlwcBdeCgx+LVQcXZ10dXAVB8APEydFJ0UVK/F9SaBHjwXE/3t173L0D/M0aU82ecUDVLCOTTIj5wooYfEUIEQgYRExipp7KLuTgOb7u4ePrXZxneZ/7c/QrRZMBPpF4lumGRbxOPL1p6Zz3iQVWkRTic+Ixgy5I/Mh12eU3zmWH/TxTMHKZOWKBWCx3sdzFrGKoxFPEUUXVKN+fd1nhvMVZrdVZ+578heGitpzlOs0RJLGIFNIQIaOOKmqwEKdVI8VEhvYTHv5hx58ml0yuKhg55rEBFZLjB/+D392apckJNymcAHpfbPsjBgR3gVbDtr+Pbbt1AgSegSut499oAjOfpDc6WvQIGNgGLq47mrwHXO4AkSddMiRHCtD0l0rA+xl9UwEYugX6Vt3e2vs4fQBy1NXSDXBwCIyWKXvN492h7t7+PdPu7weVs3K1THf6MgAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+QIGBQVD1j5N6wAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAeklEQVRIx2NgGAWjYBTQHDAic77/+PGfGoZycnDAzWVBNtxJTY0qrv7+48d/mCUs6JJ89XsYpJ1VyTb8up08AwMDA4MsP///xx8/MjKhK6DE8Kd7b2OIseByAbUAC3LEUCuS1cTFsaciWNhRw5LHHz8yjmbSUTAKIAAAHrcgEXUU5YwAAAAASUVORK5CYII=';

const rectangleIcon = new Image();
rectangleIcon.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9bpUUqgmYo4pChdbIgKuIoVSyChdJWaNXB5NIvaGJIUlwcBdeCgx+LVQcXZ10dXAVB8APEydFJ0UVK/F9SaBHjwXE/3t173L0D/M0aU82ecUDVLCOTTIj5wooYfEUIEQgYRExipp7KLuTgOb7u4ePrXZxneZ/7c/QrRZMBPpF4lumGRbxOPL1p6Zz3iQVWkRTic+Ixgy5I/Mh12eU3zmWH/TxTMHKZOWKBWCx3sdzFrGKoxFPEUUXVKN+fd1nhvMVZrdVZ+578heGitpzlOs0RJLGIFNIQIaOOKmqwEKdVI8VEhvYTHv5hx58ml0yuKhg55rEBFZLjB/+D392apckJNymcAHpfbPsjBgR3gVbDtr+Pbbt1AgSegSut499oAjOfpDc6WvQIGNgGLq47mrwHXO4AkSddMiRHCtD0l0rA+xl9UwEYugX6Vt3e2vs4fQBy1NXSDXBwCIyWKXvN492h7t7+PdPu7weVs3K1THf6MgAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+QIGBQVGNsqsmsAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAA0klEQVRIx2NgGAUEACM2we8/fvwnxzBODg4M81iwGe6kpkaWa7//+PEf3RIWbIbz1e9hkHZWJcnwp3tvMzipqWFYwoJNsbSzKsPTvbdJskDaWZXhUyOELcvP///xx4+MDAwMDEz4NL3beozh3dZjRPOxASZCLhPytkJho/MJASZiDSdXDROt8wHBOCAEKI4DmvpgNA6I8gGhjEYIsJASvoT4RFvwdO9tsgo7ouoDSorrfbduMaiJizMwMDAwwAo7qlY46IbjtABW5JJjCbLhwwMAAI5+ZZrvEYecAAAAAElFTkSuQmCC';

const fillIcon = new Image();
fillIcon.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9bpUUqgmYo4pChdbIgKuIoVSyChdJWaNXB5NIvaGJIUlwcBdeCgx+LVQcXZ10dXAVB8APEydFJ0UVK/F9SaBHjwXE/3t173L0D/M0aU82ecUDVLCOTTIj5wooYfEUIEQgYRExipp7KLuTgOb7u4ePrXZxneZ/7c/QrRZMBPpF4lumGRbxOPL1p6Zz3iQVWkRTic+Ixgy5I/Mh12eU3zmWH/TxTMHKZOWKBWCx3sdzFrGKoxFPEUUXVKN+fd1nhvMVZrdVZ+578heGitpzlOs0RJLGIFNIQIaOOKmqwEKdVI8VEhvYTHv5hx58ml0yuKhg55rEBFZLjB/+D392apckJNymcAHpfbPsjBgR3gVbDtr+Pbbt1AgSegSut499oAjOfpDc6WvQIGNgGLq47mrwHXO4AkSddMiRHCtD0l0rA+xl9UwEYugX6Vt3e2vs4fQBy1NXSDXBwCIyWKXvN492h7t7+PdPu7weVs3K1THf6MgAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+QIGBQVI2ohW08AAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAABpElEQVRIx82VMUtCURiGH0PQlhxFwusSBxyCwKGMKLiELc5uIQ0FDtFWUzQb1B/oB0Q2NCfq4OQ/EE4tInFxKGlKabgNcS733vQeFaPOdM65l+f9vu+83znw38bHYGB/DAb2pP+Hp4WbQjjzxWg0NNfIs4Zh3x+s2d3bdTtrGBNlsjCLWKs6pFJOYAqBTmQmgev6m2edjMXsuQr8inNU/bOG4TmDZCxmB2UwlYteF1cp5gGkZ7/7/h6auUTKmsX8DgBbx+cA3DzWMIVA9nqzu2gUvH1ZcL4rkSAnhSeBP2TOudr83t/IRWhVh6TXfoqMarxQEHzpogZAadliJZUA4LljAThrtVc+2qchJX4R7RmUlq0fYD880z8d23haAT9MCbnh/uG2bWhcedLNDu3tlFNnN1iNTP+UVnXIRi5C4cyiISUiHvdYV5tBQ0oO93Y9mQB83p1o4VqBdLODKYQj4oYrRwXBp+rkhpSYQlApJyAXAdDCtQIv9SdnLuJxZK+HenCUaBBce7mNutDUkznJRTe20RRIRe6P0A2dKvJRftZF+OfjCySNE5ddU05FAAAAAElFTkSuQmCC';

const eraseIcon = new Image();
eraseIcon.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9bpUUqgmYo4pChdbIgKuIoVSyChdJWaNXB5NIvaGJIUlwcBdeCgx+LVQcXZ10dXAVB8APEydFJ0UVK/F9SaBHjwXE/3t173L0D/M0aU82ecUDVLCOTTIj5wooYfEUIEQgYRExipp7KLuTgOb7u4ePrXZxneZ/7c/QrRZMBPpF4lumGRbxOPL1p6Zz3iQVWkRTic+Ixgy5I/Mh12eU3zmWH/TxTMHKZOWKBWCx3sdzFrGKoxFPEUUXVKN+fd1nhvMVZrdVZ+578heGitpzlOs0RJLGIFNIQIaOOKmqwEKdVI8VEhvYTHv5hx58ml0yuKhg55rEBFZLjB/+D392apckJNymcAHpfbPsjBgR3gVbDtr+Pbbt1AgSegSut499oAjOfpDc6WvQIGNgGLq47mrwHXO4AkSddMiRHCtD0l0rA+xl9UwEYugX6Vt3e2vs4fQBy1NXSDXBwCIyWKXvN492h7t7+PdPu7weVs3K1THf6MgAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+QIGBQVLhSQJ/IAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAABK0lEQVRIx2NgGAUEACMxir7/+PEfXYyTg4MovSzEGO6kpkbQUlwWshBj+EwDNQZpNWm4+NNbTxnQLf3+48d/bJawEONNZMNh/C1oYk5qalgtYSLG9YTA01tP4WxZfv7/RFmAy/WkAiZqup5oC0h1/ek7z4i3gBzXz/nyhWHfrVsMauLixCdT7t4Ohg9Q9pO7Txh09qwnyvWPP35kxGkBzPUdsyahaJJRlmH4oJyLInZw53YGk1tP8boeZxzIKMvgDZond58wMDAwMJxxs8freqKSKTZw985lBgYGBobZXbPxuh5nHMBciM1H6HL4XE90UYFsKCmux7CAk4ODEVvpiR7pxLoeqw9glqAXZOiAGNfjrXCQC61bL19iyMMMx+d6oms0bKUkMYYPDwAArdGaa9wnQ0IAAAAASUVORK5CYII=';

const saveIcon = new Image();
saveIcon.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9bpUUqgmYo4pChdbIgKuIoVSyChdJWaNXB5NIvaGJIUlwcBdeCgx+LVQcXZ10dXAVB8APEydFJ0UVK/F9SaBHjwXE/3t173L0D/M0aU82ecUDVLCOTTIj5wooYfEUIEQgYRExipp7KLuTgOb7u4ePrXZxneZ/7c/QrRZMBPpF4lumGRbxOPL1p6Zz3iQVWkRTic+Ixgy5I/Mh12eU3zmWH/TxTMHKZOWKBWCx3sdzFrGKoxFPEUUXVKN+fd1nhvMVZrdVZ+578heGitpzlOs0RJLGIFNIQIaOOKmqwEKdVI8VEhvYTHv5hx58ml0yuKhg55rEBFZLjB/+D392apckJNymcAHpfbPsjBgR3gVbDtr+Pbbt1AgSegSut499oAjOfpDc6WvQIGNgGLq47mrwHXO4AkSddMiRHCtD0l0rA+xl9UwEYugX6Vt3e2vs4fQBy1NXSDXBwCIyWKXvN492h7t7+PdPu7weVs3K1THf6MgAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+QIGBQVN3D7jzIAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAA4ElEQVRIx2NgGAUDDRhxSXz/8eM/KQZxcnBgNYsFl+FOamokufT7jx//sVnCgstwC6dMBgl1RQZ1Q0kGFXlJrIbeefic4eb55wwvbt5ncFJTw2oJEy4XSagrMjAwMOA0PNXdBUMtAwMDgyw//3+iLKAWIGjBnYfPsYqXz1pMlAUshBTcPA8JZ5r5gFJA0Acvbt7HK48cwWRZgM8QQpYTbQExBg1fHzARMvTEvukMEuqKWPGJfdMJOoCRWoXdvlu3GNTExRkYGBgYHn/8yEj14hqb4XgtwFZwEQLoho8CogAAz0BbPsc/fBQAAAAASUVORK5CYII=';

const reloadIcon = new Image();
reloadIcon.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9bpUUqgmYo4pChdbIgKuIoVSyChdJWaNXB5NIvaGJIUlwcBdeCgx+LVQcXZ10dXAVB8APEydFJ0UVK/F9SaBHjwXE/3t173L0D/M0aU82ecUDVLCOTTIj5wooYfEUIEQgYRExipp7KLuTgOb7u4ePrXZxneZ/7c/QrRZMBPpF4lumGRbxOPL1p6Zz3iQVWkRTic+Ixgy5I/Mh12eU3zmWH/TxTMHKZOWKBWCx3sdzFrGKoxFPEUUXVKN+fd1nhvMVZrdVZ+578heGitpzlOs0RJLGIFNIQIaOOKmqwEKdVI8VEhvYTHv5hx58ml0yuKhg55rEBFZLjB/+D392apckJNymcAHpfbPsjBgR3gVbDtr+Pbbt1AgSegSut499oAjOfpDc6WvQIGNgGLq47mrwHXO4AkSddMiRHCtD0l0rA+xl9UwEYugX6Vt3e2vs4fQBy1NXSDXBwCIyWKXvN492h7t7+PdPu7weVs3K1THf6MgAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+QIGBQWA3piKEQAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAABe0lEQVRIx9VVq7KDMBDdzCBARVbcwaaytpoavoUf4Bv6A/0WDGgsklgGUYkqjorOMpvthuSaO3PXpSTn7OPsKcB/DxVz6bWuG/8tS9Oot0kMaGGM9zsS8fMhwWtdNwr6uP/A+ZLv53GYdlIEpmdKonzgHFSKcZigqmcniVvZQ2ftXkkigbfNVQThFZ0vObTNB5Qnk2u9TcuikiPwW9kDAEBnrfP40455J6JvooaMWSOwOZ2c7/b5hMIYqOoZ2iaPU1GWpooOt7PWAZ6WRfkqjZYpktCsEViqkvd9HKbwoklLxfXNZUyDVu4MOfSQ6ptWyoNXnsTqvzDmiyTXeqOD5/MSVSSB096ivqXBI1GWpmEvknaBy5XaBFbOKw0StM0VbmUPhTG0DY7/SJL92mQpc7qp1OB8Jog+RCv1bjIAQFXP8LiD4zuhzecqUj6Zok3gWbJsaoIS+OGi4WXsu7Qf1AR9my/aAOobL+dab1TnHFTS/6/+kzlxCPRP4w3A6io0yt+JDgAAAABJRU5ErkJggg==';

const undoIcon = new Image();
undoIcon.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9bpUUqgmYo4pChdbIgKuIoVSyChdJWaNXB5NIvaGJIUlwcBdeCgx+LVQcXZ10dXAVB8APEydFJ0UVK/F9SaBHjwXE/3t173L0D/M0aU82ecUDVLCOTTIj5wooYfEUIEQgYRExipp7KLuTgOb7u4ePrXZxneZ/7c/QrRZMBPpF4lumGRbxOPL1p6Zz3iQVWkRTic+Ixgy5I/Mh12eU3zmWH/TxTMHKZOWKBWCx3sdzFrGKoxFPEUUXVKN+fd1nhvMVZrdVZ+578heGitpzlOs0RJLGIFNIQIaOOKmqwEKdVI8VEhvYTHv5hx58ml0yuKhg55rEBFZLjB/+D392apckJNymcAHpfbPsjBgR3gVbDtr+Pbbt1AgSegSut499oAjOfpDc6WvQIGNgGLq47mrwHXO4AkSddMiRHCtD0l0rA+xl9UwEYugX6Vt3e2vs4fQBy1NXSDXBwCIyWKXvN492h7t7+PdPu7weVs3K1THf6MgAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+QIGBQWHYBtFScAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAABKUlEQVRIx+1Uq7LCMBA97URwMchiro2s7AdUFF3db0H1W9DVRfABlZWx14DEAK6Ym50lbJqAwXBmOtNNZs7Zx9kAX3waie/iertNAPCzWCQ8dmHvfVA+8lLrByEbhxIJCljyZbtGXeREbGMXPBFJJPWVxsl85ADQ9BWW7Rql1mIbVWhITV/R/26zf7izwnWRo2tBIrySNNYN3TACAA7G0HfZHumcV/i7Wk0vC9RFjqavqOc6y0hkDmko49BZCErytXXSDs/ZHYyBzrL3BbiIdGfJ/87nBMD0loBbCc/enE42pH2Za5+aeypKrcmm3TA+bTPfj8v2KLZPveIi9HmUIf7bF98i3yZ3w0g29Q0/CWXuzkFylTD8eIG5p5oTS+TRAu76u5CIv4jGHaoeqH4byFz/AAAAAElFTkSuQmCC';

const redoIcon = new Image();
redoIcon.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9bpUUqgmYo4pChdbIgKuIoVSyChdJWaNXB5NIvaGJIUlwcBdeCgx+LVQcXZ10dXAVB8APEydFJ0UVK/F9SaBHjwXE/3t173L0D/M0aU82ecUDVLCOTTIj5wooYfEUIEQgYRExipp7KLuTgOb7u4ePrXZxneZ/7c/QrRZMBPpF4lumGRbxOPL1p6Zz3iQVWkRTic+Ixgy5I/Mh12eU3zmWH/TxTMHKZOWKBWCx3sdzFrGKoxFPEUUXVKN+fd1nhvMVZrdVZ+578heGitpzlOs0RJLGIFNIQIaOOKmqwEKdVI8VEhvYTHv5hx58ml0yuKhg55rEBFZLjB/+D392apckJNymcAHpfbPsjBgR3gVbDtr+Pbbt1AgSegSut499oAjOfpDc6WvQIGNgGLq47mrwHXO4AkSddMiRHCtD0l0rA+xl9UwEYugX6Vt3e2vs4fQBy1NXSDXBwCIyWKXvN492h7t7+PdPu7weVs3K1THf6MgAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+QIGBQWJahvrbkAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAABIklEQVRIx+1VqxaCQBC96yGAhYjFupHoBxDsZr/FxLeYyRQ/gEikWiRalIZBhzMsuzBosHDPIeze3TvPHYAF/4aSHHo2TWvbD3xfcZ7WHJ5EONFaxD+bpjWNeGPidPGY7wd8VpTgPK1NI6sx8XW6sYoDwGEXY51uemvCNgxbZwRcnC5lRYnH6dY7d8z3bz6PR+u3chGm+KWquo/2JfCmDpC4jiJUdY1Ea2faZkUwBpv3roi8OcKB7yuq0Rm3AU+Rfm2AG7FxJH6939Wkgawou1ZMtEZV1wDQCfPHxz3n4lYDPA3IYxx2MbJ0+Jp5G5MDs0cFRSHpd3pgZgRKMiq4t6YDvI1tKVK/DLup/IvG9TYM20+BIe2c2f8Dc4CZcIkvEOEFIdSyhtt+PqwAAAAASUVORK5CYII=';


class WindowCycloneMapEditorCommands extends Window_Command {
  constructor() {
    const x = Graphics.width - CycloneMapEditor.windowWidth;
    const y = 0;
    const w = CycloneMapEditor.windowWidth;
    const h = 74;
    super(new Rectangle(x, y, w, h));
    this.showBackgroundDimmer();
  }

  processCursorMove() {
  }

  processHandling() {
  }

  updateBackOpacity() {
    this.backOpacity = 255;
  }

  _updateCursor() {
    this._cursorSprite.visible = false;
  }

  makeCommandList() {
    this.addCommand('Undo', 'undo');
    this.addCommand('Redo', 'redo');

    this.addCommand('', '');

    this.addCommand('Pen', 'pencil');
    this.addCommand('Rect', 'rectangle');
    this.addCommand('Fill', 'fill');
    this.addCommand('Erase', 'eraser');

    // this.addCommand('Save', 'save');
    // this.addCommand('Reload', 'reload');

    this.setHandler('undo', () => {
      CycloneMapEditor.undoButton();
      this.activate();
    });
    this.setHandler('redo', () => {
      CycloneMapEditor.redoButton();
      this.activate();
    });
    this.setHandler('pencil', () => {
      CycloneMapEditor.pencilButton();
      this.activate();
    });
    this.setHandler('rectangle', () => {
      CycloneMapEditor.rectangleButton();
      this.activate();
    });
    this.setHandler('fill', () => {
      CycloneMapEditor.fillButton();
      this.activate();
    });
    this.setHandler('eraser', () => {
      CycloneMapEditor.eraserButton();
      this.activate();
    });
    this.setHandler('save', () => {
      CycloneMapEditor.saveButton();
      this.activate();
    });
    this.setHandler('reload', () => {
      CycloneMapEditor.reloadButton();
      this.activate();
    });
  }

  colSpacing() {
    return 6;
  }

  rowSpacing() {
    return 0;
  }

  maxCols() {
    return 7;
  }

  redraw() {
    Window_Selectable.prototype.refresh.call(this);
  }

  // itemWidth() {
  //   return ImageManager.iconWidth;
  // }

  // itemHeight() {
  //   return ImageManager.iconHeight;
  // }
  //

  getSymbolIcon(symbol) {
    switch(symbol) {
      case 'undo':
        return undoIcon;
      case 'redo':
        return redoIcon;
      case 'pencil':
        return pencilIcon;
      case 'rectangle':
        return rectangleIcon;
      case 'fill':
        return fillIcon;
      case 'eraser':
        return eraseIcon;
      case 'save':
        return saveIcon;
      case 'reload':
        return reloadIcon;
    }
  }

  drawItem(index) {
    const symbol = this.commandSymbol(index);
    const rect = this.itemRect(index);


    if (symbol === CycloneMapEditor.currentTool) {
      this.contents.fillRect(rect.x, rect.y + 2, rect.width, rect.height, '#00FF0066');

      this.contents.fillRect(rect.x -2, rect.y, rect.width + 4, 4, '#000000');
      this.contents.fillRect(rect.x -2, rect.y + 2 + rect.height, rect.width + 6, 4, '#000000');
      this.contents.fillRect(rect.x - 2, rect.y, 4, rect.height + 4, '#000000');
      this.contents.fillRect(rect.x + rect.width, rect.y, 4, rect.height + 4, '#000000');

      this.contents.fillRect(rect.x, rect.y + 2, rect.width, 2, '#FFFFFF');
      this.contents.fillRect(rect.x, rect.y + 2 + rect.height, rect.width + 2, 2, '#FFFFFF');
      this.contents.fillRect(rect.x, rect.y + 2, 2, rect.height, '#FFFFFF');
      this.contents.fillRect(rect.x + rect.width, rect.y + 2, 2, rect.height, '#FFFFFF');
    }

    const icon = this.getSymbolIcon(symbol);

    if (!icon) {
      return super.drawItem(index);
    }

    this.resetTextColor();
    if (symbol === 'undo') {
      this.changePaintOpacity(CycloneMapEditor.changeHistory.length > 0);
    } else if (symbol === 'redo') {
      this.changePaintOpacity(CycloneMapEditor.undoHistory.length > 0);
    } else {
      this.changePaintOpacity(true);
    }

    const ctx = this.contents._canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(icon, rect.x + 1, rect.y, 48, 48);
  }

  drawAllItems() {
    super.drawAllItems();
  }

  playCursorSound() {
  }

  playOkSound() {
  }

  playBuzzerSound() {
  }
}

const hiddenIcon = new Image();
hiddenIcon.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9bpUUqgmYo4pChdbIgKuIoVSyChdJWaNXB5NIvaGJIUlwcBdeCgx+LVQcXZ10dXAVB8APEydFJ0UVK/F9SaBHjwXE/3t173L0D/M0aU82ecUDVLCOTTIj5wooYfEUIEQgYRExipp7KLuTgOb7u4ePrXZxneZ/7c/QrRZMBPpF4lumGRbxOPL1p6Zz3iQVWkRTic+Ixgy5I/Mh12eU3zmWH/TxTMHKZOWKBWCx3sdzFrGKoxFPEUUXVKN+fd1nhvMVZrdVZ+578heGitpzlOs0RJLGIFNIQIaOOKmqwEKdVI8VEhvYTHv5hx58ml0yuKhg55rEBFZLjB/+D392apckJNymcAHpfbPsjBgR3gVbDtr+Pbbt1AgSegSut499oAjOfpDc6WvQIGNgGLq47mrwHXO4AkSddMiRHCtD0l0rA+xl9UwEYugX6Vt3e2vs4fQBy1NXSDXBwCIyWKXvN492h7t7+PdPu7weVs3K1THf6MgAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+QIGBQWFPmxrYMAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAABBElEQVRIx+2UMQqDMBSGf4uDTo6dXCMIXsJLCEIPUfAYBc8gQqF3EM/woFBo1k4dOzWbnSJRk5jSsf4gmOfL95u8lwCbNv0qzzXxLcSgjsMgcJrru4JzxrTxNSN/DS7BVV1Pvsn4W4jBZuKtwSU4STMAwP12neSdjkf0nBtXsluDJ2k2wlUREZI0Q1XXyBlb1MhoMIdLXc7t4u/lymwmO9MWEdFkXJQHENH4FOVBmxtH0WAtchgEnlpcFaS+qyvrmgY952D7vVsXzU108Mu5BYAF/PF6eU5tqjNR1TUNAFjhTifZdNB6zgHACne+KuIoGvjzOYmp+22Cf3UX6TrEBt70R/oAQESSsFk1AwIAAAAASUVORK5CYII=';

const visibleIcon = new Image();
visibleIcon.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9bpUUqgmYo4pChdbIgKuIoVSyChdJWaNXB5NIvaGJIUlwcBdeCgx+LVQcXZ10dXAVB8APEydFJ0UVK/F9SaBHjwXE/3t173L0D/M0aU82ecUDVLCOTTIj5wooYfEUIEQgYRExipp7KLuTgOb7u4ePrXZxneZ/7c/QrRZMBPpF4lumGRbxOPL1p6Zz3iQVWkRTic+Ixgy5I/Mh12eU3zmWH/TxTMHKZOWKBWCx3sdzFrGKoxFPEUUXVKN+fd1nhvMVZrdVZ+578heGitpzlOs0RJLGIFNIQIaOOKmqwEKdVI8VEhvYTHv5hx58ml0yuKhg55rEBFZLjB/+D392apckJNymcAHpfbPsjBgR3gVbDtr+Pbbt1AgSegSut499oAjOfpDc6WvQIGNgGLq47mrwHXO4AkSddMiRHCtD0l0rA+xl9UwEYugX6Vt3e2vs4fQBy1NXSDXBwCIyWKXvN492h7t7+PdPu7weVs3K1THf6MgAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+QIGBQWDOrdNdUAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAABOUlEQVRIx+2Uu07DMBSG/6AM6WR1apdYQkiRMrUbZM1SXgB2RkYY8hBdsvYJOtCpEqqYuvQpsIQiAQOdok7xdphOidM2NmIkv+ThHNvfufgCdOr0V3muCyutqW73gsBpr+8KTqPoqN8WyLfBGTyfxcYc+yutqS2Ib4MzeJguDTD70yiyBjkKT6SkYjWhSmtjJFJSIiUt7sZUaU3FakKJlNQ8I9ZZW+acNQA8318dnANXNp/F+0qcW/T5+oVh+mPH2RMecWvY9bWsUAj62O08pxZt8tFBi5pjk4/2LQqFoFAIslbQCwKPWzXFJQCgf73AxbkEALwV7yhfbgAAWV5irRSiwQAA0Mzec72m04e+MZflJQC0wp1e8qmHtlYKAFrhzl9FKASp7dbwMbgN/qu/iAPVbett6fQ/9A0c7tBBCKKL7gAAAABJRU5ErkJggg==';

class WindowCycloneMapEditorLayerList extends Window_Base {
  constructor() {
    const x = Graphics.width - CycloneMapEditor.windowWidth;
    const y = SceneManager._scene._mapEditorCommands.height;
    const h = 150;
    super(new Rectangle(x, y, CycloneMapEditor.windowWidth, h));
    this.showBackgroundDimmer();
  }

  update() {
    super.update();
  }

  updateBackOpacity() {
    this.backOpacity = 255;
  }

  refresh() {
    this.drawContents();
    SceneManager._scene.redrawMap();
  }

  drawContents() {
    this.contents.clear();
    this.contents.fontSize = 22;
    const ctx = this.contents._canvas.getContext('2d');

    const names = [
      'Layer 1',
      'Layer 2',
      'Layer 3',
      'Layer 4',
      'Shadows',
      'Regions',
      false,
      'Auto Layer'
    ];

    ctx.imageSmoothingEnabled = false;
    for (let i = 0; i < 4; i++) {
      ctx.drawImage(CycloneMapEditor.layerVisibility[i] ? visibleIcon : hiddenIcon, -4, 30 * i - 4, 48, 48);
      this.contents.fontBold = CycloneMapEditor.currentLayer === i;
      this.changeTextColor(CycloneMapEditor.currentLayer === i ? ColorManager.powerUpColor() : ColorManager.normalColor());

      this.drawText(names[i], 40, i * 30, CycloneMapEditor.windowWidth / 2 - 40, 'left');

      if (names[i + 4]) {
        let x = CycloneMapEditor.windowWidth / 2;

        if (i !== 3) {
          ctx.drawImage(CycloneMapEditor.layerVisibility[i + 4] ? visibleIcon : hiddenIcon, x - 4, 30 * i - 4, 48, 48);
          x += 40;
        } else {
          x += 10;
        }
        this.contents.fontBold = CycloneMapEditor.currentLayer === (i + 4);
        this.changeTextColor(CycloneMapEditor.currentLayer === (i + 4) ? ColorManager.powerUpColor() : ColorManager.normalColor());
        this.drawText(names[i + 4], x, i * 30, CycloneMapEditor.windowWidth / 2 - 40, 'left');
      }
    }
  }

  toggleLayerVisibility(layerIndex) {
    CycloneMapEditor.layerVisibility[layerIndex] = !CycloneMapEditor.layerVisibility[layerIndex];
    this.refresh();
    SceneManager._scene._mapEditorGrid.refresh();
  }

  getLayerIndex(y) {
    const padding = this.padding + 10;

    if (y < padding || y > this.height - padding + 6) {
      return -1;
    }

    const layerIndex = Math.floor((y - padding) / 30);
    if (y > padding + (layerIndex * 30) + 22) {
      return -1;
    }

    if (layerIndex > CycloneMapEditor.layerVisibility.length) {
      return -1;
    }

    return layerIndex;
  }

  onMapTouch(x, y) {
    let layerIndex = this.getLayerIndex(y);
    if (layerIndex < 0) {
      return;
    }

    if (x >= CycloneMapEditor.windowWidth / 2) {
      x -= CycloneMapEditor.windowWidth / 2;
      layerIndex += 4;
    }

    if (x < 50) {
      this.toggleLayerVisibility(layerIndex);
      return;
    }

    CycloneMapEditor.changeCurrentLayer(layerIndex);
    this.refresh();
  }
}

class WindowCycloneMapEditorStatus extends Window_Base {
  constructor() {
    const h = 40;
    super(new Rectangle(0, Graphics.height - h, Graphics.width, h));
    this.showBackgroundDimmer();
  }

  createContents() {
    this._padding = 0;
    super.createContents();
  }

  updateBackOpacity() {
    this.backOpacity = 255;
  }

  refresh() {
    this.drawContents();
  }

  lineHeight() {
    return 16;
  }

  // eslint-disable-next-line complexity
  drawContents() {
    this.contents.clear();
    this.contents.fontSize = 16;

    let line = '';
    let splitter = '';

    if (CycloneMapEditor.params.showMapId) {
      line += `${ splitter }Map: ${ $gameMap._mapId }`;
      splitter = ', ';
    }

    if (CycloneMapEditor.params.showTilesetId) {
      line += `${ splitter }Tileset: ${ $gameMap._tilesetId }`;
      splitter = ', ';
    }

    if (CycloneMapEditor.params.showPosition) {
      line += `${ splitter }Pos: ${ CycloneMapEditor.statusMapX }, ${ CycloneMapEditor.statusMapY }`;
      splitter = ', ';
    }

    if (CycloneMapEditor.params.showCellTiles) {
      const { statusTile1, statusTile2, statusTile3, statusTile4 } = CycloneMapEditor;
      if (line) {
        line += ' - ';
      }

      line += `Tiles: (${ statusTile1 }, ${ statusTile2 }, ${ statusTile3 }, ${ statusTile4 })`;
      splitter = ', ';
    }

    if (CycloneMapEditor.params.showRegionId) {
      line += `${ splitter }Region: ${ CycloneMapEditor.statusRegion }`;
      splitter = ', ';
    }

    if (CycloneMapEditor.params.showTag) {
      line += `${ splitter }Tag: ${ CycloneMapEditor.statusTag }`;
      splitter = ', ';
    }

    if (CycloneMapEditor.params.showCollision) {
      line += `${ splitter }Collision: ${ CycloneMapEditor.statusCollision }`;
      splitter = ', ';
    }

    if (CycloneMapEditor.params.showLadder && CycloneMapEditor.statusLadder) {
      line += `${ splitter } Ladder`;
      splitter = ', ';
    }

    if (CycloneMapEditor.params.showBush && CycloneMapEditor.statusBush) {
      line += `${ splitter } Bush`;
      splitter = ', ';
    }

    if (CycloneMapEditor.params.showCounter && CycloneMapEditor.statusCounter) {
      line += `${ splitter } Counter`;
      splitter = ', ';
    }

    if (CycloneMapEditor.params.showDamageFloor && CycloneMapEditor.statusDamage) {
      line += `${ splitter } Damage`;
      splitter = ', ';
    }

    this.drawText(`${ line }`, 8, 12, this.width - 8, 'left');
    this.drawText(`TileId: ${ CycloneMapEditor.statusTileId }`, 0, 12, this.width - 8, 'right');
  }
}

class WindowCycloneMapEditor extends Window_Command {
  constructor() {
    const x = Graphics.width - CycloneMapEditor.windowWidth;
    const y = SceneManager._scene._mapEditorLayerListWindow.y + SceneManager._scene._mapEditorLayerListWindow.height;
    const w = CycloneMapEditor.windowWidth;
    const h = Graphics.height - y - SceneManager._scene._mapEditorStatus.height;
    super(new Rectangle(x, y, w, h));
    this.showBackgroundDimmer();
  }

  onMapTouch(x, y) {

  }

  updateBackOpacity() {
    this.backOpacity = 255;
  }

  _updateCursor() {
    this._cursorSprite.visible = false;
  }

  processCursorMove() {
  }

  processHandling() {
  }

  addTile(tileId) {
    if (!CycloneMapEditor.getTilesetName(tileId)) {
      return;
    }

    if (Tilemap.isAutotile(tileId)) {
      if (Tilemap.isWallSideTile(tileId) || Tilemap.isRoofTile(tileId)) {
        this.addCommand(tileId, 'tile', true, tileId);
      } else if (Tilemap.isWaterfallTile(tileId)) {
        this.addCommand(tileId, 'tile', true, tileId);
      } else {
        this.addCommand(tileId, 'tile', true, tileId + 46);
      }
      return;
    }

    this.addCommand(tileId, 'tile', true, tileId);
  }

  makeManualTilesList() {
    const tileId = this._manualTileSelected;
    let maxShape = 46;

    if (Tilemap.isWallSideTile(tileId) || Tilemap.isRoofTile(tileId)) {
      maxShape = 15;
    } else if (Tilemap.isWaterfallTile(tileId)) {
      maxShape = 3;
    }

    for (let i = 0; i <= maxShape; i++) {
      this.addCommand(tileId + i, 'tile', true, tileId + i);
    }
  }

  makeShadowList() {
    for (let i = 0; i <= 15; i++) {
      this.addCommand(i, 'shadow', true, i);
    }
  }

  makeRegionList() {
    for (let i = 0; i <= 255; i++) {
      this.addCommand(i, 'region', true, i);
    }
  }

  makeCommandList() {
    if (this._manualTileSelected) {
      this.makeManualTilesList();
      return;
    }

    if (CycloneMapEditor.currentLayer === 4) {
      this.makeShadowList();
      return;
    }

    if (CycloneMapEditor.currentLayer === 5) {
      this.makeRegionList();
      return;
    }

    for (let tileId = Tilemap.TILE_ID_A1; tileId < Tilemap.TILE_ID_MAX; tileId += 48) {
      this.addTile(tileId);
    }

    for (let tileId = Tilemap.TILE_ID_B; tileId < Tilemap.TILE_ID_A5; tileId++) {
      this.addTile(tileId);
    }
  }

  ensureSelectionVisible() {
    if (this._selectionIndex < 0 || CycloneMapEditor.currentTileId === undefined) {
      return;
    }

    const row = Math.floor(this._selectionIndex / this.maxCols());
    if (row < this.topRow()) {
      this.setTopRow(Math.min(row, this.maxTopRow()));
    } else if (row > this.topRow() + this.maxPageRows()) {
      this.setTopRow(Math.min(row, this.maxTopRow()));
    }
  }

  redraw() {
    Window_Selectable.prototype.refresh.call(this);

    // Force the tilemap cursor to redraw too
    SceneManager._scene._spriteset._mapEditorCursor.updateDrawing();
  }

  colSpacing() {
    return Math.floor((this.width - (this.maxCols() * this.itemWidth())) / this.maxCols());
  }

  rowSpacing() {
    return 0;
  }

  maxCols() {
    return 8;
  }

  itemWidth() {
    return 48;
    // return tileWidth;
  }

  itemHeight() {
    return 48;
    // return tileHeight;
  }

  drawRegion(index) {
    const rect = this.itemRect(index);
    this.contents.drawRegion(index, rect.x, rect.y, rect.width, rect.height);
  }

  drawShadow(index) {
    const rect = this.itemRect(index);
    this.contents.drawShadow(index, rect.x, rect.y, rect.width, rect.height);
  }

  drawItem(index) {
    this.resetTextColor();
    this.changePaintOpacity(this.isCommandEnabled(index));

    const symbol = this.commandSymbol(index);

    if (symbol === 'region') {
      this.drawRegion(index);
      return;
    }

    if (symbol === 'shadow') {
      this.drawShadow(index);
      return;
    }

    const rect = this.itemRect(index);
    const bitmap = this.contents.drawTile(this._list[index].ext, rect.x, rect.y, this.itemWidth(), this.itemHeight());
    if (!bitmap) {
      return;
    }

    if (!bitmap.isReady() && bitmap._loadListeners.length < 2) {
      bitmap.addLoadListener(() => {
        this._needsRefresh = true;
      });
    }
  }

  drawAllItems() {
    super.drawAllItems();
    this.drawSelection();
  }

  drawMessySelection() {
    this._selectionIndex = -1;

    for (let index = 0; index < this._list.length; index++) {
      const item = this._list[index];
      let isSelected = Tilemap.isSameKindTile(item.name, CycloneMapEditor.currentTileId);
      if (isSelected) {
        this._selectionIndex = index;
      } else {
        for (const tileId of CycloneMapEditor.selectedTileList) {
          if (Tilemap.isSameKindTile(tileId, item.name)) {
            isSelected = true;
          }
        }
      }

      if (!isSelected) {
        continue;
      }

      this._drawSelection(index, 1, 1);
    }
  }

  _drawSelection(topIndex, rowDrawCount, colDrawCount) {
    const rect = this.itemRect(topIndex);
    const { x, y } = rect;

    if (!this._manualTileSelected && CycloneMapEditor.selectedTileList.length >= 2 && Tilemap.isSameKindTile(CycloneMapEditor.selectedTileList[0], CycloneMapEditor.selectedTileList[1])) {
      rowDrawCount = 1;
      colDrawCount = 1;
    }

    const selectionWidth = 48 * colDrawCount;
    const selectionHeight = 48 * rowDrawCount;

    this.contents.fillRect(x, y, selectionWidth, 4, '#000000');
    this.contents.fillRect(x, y + selectionHeight - 4, selectionWidth, 4, '#000000');
    this.contents.fillRect(x, y, 4, selectionHeight, '#000000');
    this.contents.fillRect(x + selectionWidth - 4, y, 4, selectionHeight, '#000000');

    this.contents.fillRect(x + 2, y + 2, selectionWidth - 4, 2, '#FFFFFF');
    this.contents.fillRect(x + 2, y + selectionHeight - 4, selectionWidth - 4, 2, '#FFFFFF');
    this.contents.fillRect(x + 2, y + 2, 2, selectionHeight - 4, '#FFFFFF');
    this.contents.fillRect(x + selectionWidth - 4, y + 2, 2, selectionHeight - 4, '#FFFFFF');
  }

  isSelectedTile(tileId) {
    if (!Tilemap.isSameKindTile(tileId, CycloneMapEditor.currentTileId)) {
      return false;
    }

    if (this._manualTileSelected !== undefined) {
      if (tileId !== CycloneMapEditor.currentTileId) {
        return false;
      }
    }

    return true;
  }

  drawSelection() {
    if (CycloneMapEditor.messySelection) {
      this.drawMessySelection();
      return;
    }

    const cols = this.maxCols();
    this._selectionIndex = -1;

    for (let index = 0; index < this._list.length; index++) {
      const item = this._list[index];
      if (!this.isSelectedTile(item.name)) {
        continue;
      }

      this._selectionIndex = index;

      let col = index % cols;
      let row = Math.floor(index / cols);
      let rowCount = CycloneMapEditor.tileRows;
      let colCount = CycloneMapEditor.tileCols;
      let rowDrawCount = CycloneMapEditor.tileRows <= 0 ? Math.abs(CycloneMapEditor.tileRows) + 2 : CycloneMapEditor.tileRows;
      let colDrawCount = CycloneMapEditor.tileCols <= 0 ? Math.abs(CycloneMapEditor.tileCols) + 2 : CycloneMapEditor.tileCols;

      while (rowCount <= 0) {
        rowCount++;
        row--;
      }

      while (colCount <= 0) {
        colCount++;
        col--;
      }

      const topIndex = (row * cols) + col;
      this._drawSelection(topIndex, rowDrawCount, colDrawCount);
      break;
    }
  }

  playCursorSound() {
  }

  playOkSound() {
  }

  playBuzzerSound() {
  }

  selectTileId(tileId, cols = 1, rows = 1) {
    if (CycloneMapEditor.currentTool === 'eraser') {
      CycloneMapEditor.restoreLastDrawingTool();
    }

    CycloneMapEditor.currentTileId = tileId;
    CycloneMapEditor.tileCols = cols ?? 1;
    CycloneMapEditor.tileRows = rows ?? 1;
    CycloneMapEditor.messySelection = false;
    CycloneMapEditor.multiLayerSelection = [];

    const topIndex = this._list.findIndex((item) => item.name === tileId);
    if (topIndex < 0) {
      CycloneMapEditor.currentTileId = undefined;
      CycloneMapEditor.selectedTileList = [];
      this.redraw();
      return;
    }

    CycloneMapEditor.selectedTileList = Array(cols * rows);
    CycloneMapEditor.selectedTileList[0] = CycloneMapEditor.currentTileId;

    const maxCols = this.maxCols();
    const topRow = Math.floor(topIndex / maxCols);
    const leftCol = topIndex % maxCols;

    let selectionIndex = 0;
    for (let y = topRow; y < topRow + CycloneMapEditor.tileRows; y++) {
      for (let x = leftCol; x < leftCol + CycloneMapEditor.tileCols; x++) {
        const newIndex = y * maxCols + x;
        const newTileId = this.commandName(newIndex);
        CycloneMapEditor.selectedTileList[selectionIndex] = newTileId;

        selectionIndex++;
      }
    }

    this.redraw();
  }

  startSelectingTile() {
    if (!this._mouseDown) {
      const index = this.hitIndex();
      if (index < 0) {
        return;
      }
      const tileId = this.commandName(index);
      this.selectTileId(tileId);
      this._mouseDown = true;
    }
  }

  findName(name) {
    return this._list.findIndex(item => item.name === name);
  }

  continueSelectingTile() {
    const index = this.hitIndex();
    const prevCols = CycloneMapEditor.tileCols;
    const prevRows = CycloneMapEditor.tileRows;

    if (index >= 0) {
      let initialIndex = this.findName(CycloneMapEditor.currentTileId);
      if (initialIndex < 0) {
        initialIndex = this._index;
      }

      const initialCol = initialIndex % this.maxCols();
      const initialRow = Math.floor(initialIndex / this.maxCols());
      const newCol = index % this.maxCols();
      const newRow = Math.floor(index / this.maxCols());

      CycloneMapEditor.tileCols = (newCol - initialCol) + 1;
      CycloneMapEditor.tileRows = (newRow - initialRow) + 1;
    }

    if (this._mouseDown) {
      if (!TouchInput.isPressed()) {
        this.finalizeTileSelection();
      } else if (TouchInput.isMoved()) {
        if (prevCols !== CycloneMapEditor.tileCols || prevRows !== CycloneMapEditor.tileRows) {
          this.redraw();
        }
      }
    }
  }

  finalizeTileSelection() {
    this._mouseDown = false;

    const cols = this.maxCols();
    for (let index = 0; index < this._list.length; index++) {
      const item = this._list[index];
      if (item.name !== CycloneMapEditor.currentTileId) {
        continue;
      }

      let col = index % cols;
      let row = Math.floor(index / cols);
      let rowCount = CycloneMapEditor.tileRows;
      let colCount = CycloneMapEditor.tileCols;
      const newTileRows = CycloneMapEditor.tileRows <= 0 ? Math.abs(CycloneMapEditor.tileRows) + 2 : CycloneMapEditor.tileRows;
      const newTileCols = CycloneMapEditor.tileCols <= 0 ? Math.abs(CycloneMapEditor.tileCols) + 2 : CycloneMapEditor.tileCols;

      while (rowCount <= 0) {
        rowCount++;
        row--;
      }

      while (colCount <= 0) {
        colCount++;
        col--;
      }

      const topIndex = (row * cols) + col;
      if (topIndex >= 0) {
        const newTileId = this.commandName(topIndex);
        if (newTileId || newTileId === 0) {
          this.selectTileId(newTileId, newTileCols, newTileRows);
        } else {
          this.selectTileId(CycloneMapEditor.currentTileId);
        }
      } else {
        this.selectTileId(0);
      }

      break;
    }

    this.redraw();
  }

  activateManualTile() {
    const index = this.hitIndex();
    if (index < 0) {
      return;
    }

    const tileId = this.commandName(index);
    if (Tilemap.isAutotile(tileId)) {
      this._manualTileSelected = tileId;
      this._selectionIndex = -1;
    }
  }

  toggleManualTiles() {
    if (this._manualTileSelected === undefined) {
      this.activateManualTile();
    } else {
      this._manualTileSelected = undefined;
    }

    this.refresh();
    this._mouseDown = false;
    CycloneMapEditor.wasRightButtonDown = CycloneMapEditor.isRightButtonDown;
  }

  processTouchScroll() {
    if (TouchInput.isTriggered() && this.isTouchedInsideFrame()) {
      this.startSelectingTile();
    } else if (CycloneMapEditor.isRightButtonDown && !CycloneMapEditor.wasRightButtonDown && !this._mouseDown) {
      this.toggleManualTiles();
      return;
    }

    if (this._mouseDown) {
      this._mouseMoved = true;
      this.continueSelectingTile();
    }
  }

  update() {
    if (this._needsRefresh) {
      this.refresh();
    }

    super.update();
  }
}

let lastDisplayX = 0;
let lastDisplayY = 0;

CycloneMapEditor.patchClass(Scene_Map, $super => class {
  createAllWindows() {
    $super.createAllWindows.call(this);

    this.createMapEditorWindows();
    CycloneMapEditor.clearAllData();
    this.refreshMapEditorWindows();
  }

  toggleMapEditor() {
    if (CycloneMapEditor.active && CycloneMapEditor.changeHistory.length > 0) {
      if (confirm('Do you want to save your map before hiding the map editor?')) {
        CycloneMapEditor._doSave();
      }
    }

    CycloneMapEditor.tileWidth = $gameMap.tileWidth();
    CycloneMapEditor.tileHeight = $gameMap.tileHeight();
    CycloneMapEditor.active = !CycloneMapEditor.active;

    this.refreshMapEditorWindows();
    this._spriteset._mapEditorCursor.updateDrawing();
    this._spriteset.updatePosition();
  }

  createMapEditorWindows() {
    CycloneMapEditor.tileWidth = $gameMap.tileWidth();
    CycloneMapEditor.tileHeight = $gameMap.tileHeight();
    const neededWidth = CycloneMapEditor.tileWidth * 8 + 24;
    if (neededWidth > CycloneMapEditor.windowWidth) {
      CycloneMapEditor.windowWidth = neededWidth;
    }

    this._mapEditorGrid = new WindowCycloneGrid();
    this.addChild(this._mapEditorGrid);
    this._mapEditorGrid.hide();
    this._mapEditorGrid.deactivate();

    this._mapEditorCommands = new WindowCycloneMapEditorCommands();
    this.addChild(this._mapEditorCommands);
    this._mapEditorCommands.hide();
    this._mapEditorCommands.deactivate();

    this._mapEditorLayerListWindow = new WindowCycloneMapEditorLayerList();
    this.addChild(this._mapEditorLayerListWindow);
    this._mapEditorLayerListWindow.hide();
    this._mapEditorLayerListWindow.deactivate();

    this._mapEditorStatus = new WindowCycloneMapEditorStatus();
    this.addChild(this._mapEditorStatus);
    this._mapEditorStatus.hide();
    this._mapEditorStatus.deactivate();

    this._mapEditorWindow = new WindowCycloneMapEditor();
    this.addChild(this._mapEditorWindow);
    this._mapEditorWindow.hide();
    this._mapEditorWindow.deactivate();
  }

  refreshMapEditorWindows() {
    const { active } = CycloneMapEditor;

    this._mapEditorGrid.visible = active;
    this._mapEditorCommands.visible = active;
    this._mapEditorLayerListWindow.visible = active;
    this._mapEditorWindow.visible = active;
    this._mapEditorStatus.visible = active;

    this._mapEditorCommands.active = active;
    this._mapEditorLayerListWindow.active = active;
    this._mapEditorWindow.active = active;

    this._mapEditorCommands.refresh();
    this._mapEditorLayerListWindow.refresh();
    this._mapEditorWindow.refresh();
    this._mapEditorGrid.refresh();
    this._mapEditorStatus.refresh();

    if (active) {
      this._spriteset._mapEditorCursor.updateDrawing();
    }
    CycloneMapEditor.refreshMenuVisibility();
  }

  redrawMap() {
    this._spriteset._tilemap.refresh();
  }

  processMapTouch() {
    if (!CycloneMapEditor.active) {
      $super.processMapTouch.call(this);
      return;
    }

    this._touchCount = 0;
    if (TouchInput.isPressed() && !this.isAnyButtonPressed()) {
      this.onMapTouch();
    }
  }

  onMapTouch() {
    if (!CycloneMapEditor.active) {
      $super.onMapTouch.call(this);
      return;
    }
  }

  editorX() {
    return Graphics.width - CycloneMapEditor.windowWidth;
  }

  canUpdateMouse() {
    return CycloneMapEditor.active && this._mapEditorWindow && this._mapEditorLayerListWindow;
  }

  updateMenuTouch(x, y, pressed) {
    if (!pressed) {
      return;
    }

    if (x > this._mapEditorLayerListWindow.x && x < this._mapEditorLayerListWindow.x + this._mapEditorLayerListWindow.width) {
      if (y < this._mapEditorLayerListWindow.height + this._mapEditorLayerListWindow.y) {
        if (!CycloneMapEditor.wasPressing) {
          this._mapEditorLayerListWindow.onMapTouch(x - this._mapEditorLayerListWindow.x, y - this._mapEditorLayerListWindow.y);
          CycloneMapEditor.wasPressing = true;
        }

        return true;
      }

      this._mapEditorWindow.onMapTouch(x - this._mapEditorWindow.x, y - this._mapEditorWindow.y);
      return true;
    }
  }

  updateRightMouse() {
    if (!this.canUpdateMouse()) {
      CycloneMapEditor.isRightButtonDown = false;
      CycloneMapEditor.wasRightButtonDown = false;
      return;
    }

    if (!CycloneMapEditor.isRightButtonDown && !CycloneMapEditor.wasRightButtonDown) {
      return;
    }

    const { x, y } = TouchInput;
    if (this.updateMenuTouch(x, y, CycloneMapEditor.isRightButtonDown)) {
      return;
    }

    const mapX = $gameMap.canvasToMapX(x);
    const mapY = $gameMap.canvasToMapY(y);

    if (mapX >= 0 && mapY >= 0) {
      CycloneMapEditor.updateRightTouch(mapX, mapY);
    }

    CycloneMapEditor.wasRightButtonDown = CycloneMapEditor.isRightButtonDown;
  }

  updateDisplayPositionData() {
    if (lastDisplayX === $gameMap._displayX && lastDisplayY === $gameMap._displayY) {
      return;
    }

    const xDiff = $gameMap._displayX - lastDisplayX;
    const yDiff = $gameMap._displayY - lastDisplayY;

    if (xDiff > 10 || yDiff > 10) {
      // If the difference is too big, then we don't update
      return;
    }

    if ((CycloneMapEditor.rectangleWidth > 0 || CycloneMapEditor.rectangleBackWidth > 0) && (CycloneMapEditor.rectangleHeight > 0 || CycloneMapEditor.rectangleBackHeight > 0)) {
      CycloneMapEditor.rectangleStartMouseX += xDiff * CycloneMapEditor.tileWidth;
      CycloneMapEditor.rectangleStartMouseY += yDiff * CycloneMapEditor.tileHeight;
    }
  }

  getSelectionTileAt(x, y) {
    if (x <= this._mapEditorWindow.x || x >= this._mapEditorWindow.x + this._mapEditorWindow.width) {
      return CycloneMapEditor.currentTileId;
    }

    if (y >= this._mapEditorWindow.height + this._mapEditorWindow.y) {
      return CycloneMapEditor.currentTileId;
    }

    const index = this._mapEditorWindow.hitIndex();
    if (index >= 0) {
      return this._mapEditorWindow.commandName(index);
    }
  }

  updateMouse() {
    if (!this.canUpdateMouse()) {
      CycloneMapEditor.wasPressing = false;
      return;
    }

    this.updateDisplayPositionData();
    lastDisplayX = $gameMap._displayX;
    lastDisplayY = $gameMap._displayY;

    const pressed = TouchInput.isPressed();
    const { x, y } = TouchInput;
    const mapX = $gameMap.canvasToMapX(x);
    const mapY = $gameMap.canvasToMapY(y);

    const tile1 = CycloneMapEditor.getCurrentTileAtPosition(mapX, mapY, 0, true);
    const tile2 = CycloneMapEditor.getCurrentTileAtPosition(mapX, mapY, 1, true);
    const tile3 = CycloneMapEditor.getCurrentTileAtPosition(mapX, mapY, 2, true);
    const tile4 = CycloneMapEditor.getCurrentTileAtPosition(mapX, mapY, 3, true);
    const tileId = this.getSelectionTileAt(x, y);

    CycloneMapEditor.updateStatus({
      mapX,
      mapY,
      tile1,
      tile2,
      tile3,
      tile4,
      tileId,
    });

    if (!pressed && !CycloneMapEditor.wasPressing) {
      return;
    }

    if (this.updateMenuTouch(x, y, pressed)) {
      return;
    }

    if (mapX >= 0 && mapY >= 0) {
      if (Input.isPressed('control')) {
        CycloneMapEditor.selectHigherLayer(mapX, mapY);
      } else {
        CycloneMapEditor.updateCurrentToolTouch(mapX, mapY);
      }
    }

    CycloneMapEditor.wasPressing = pressed;
  }


  isMenuEnabled() {
    if (CycloneMapEditor.active) {
      return false;
    }

    return $super.isMenuEnabled.call(this);
  }
});

CycloneMapEditor.patchClass(SceneManager, $super => class {
  static onSceneTerminate() {
    CycloneMapEditor.refreshMenuVisibility();
  }
});

class SpriteMapEditorCursor extends Sprite {
  initialize() {
    super.initialize(new Bitmap(CycloneMapEditor.tileWidth, CycloneMapEditor.tileHeight));
  }

  update() {
    super.update();
    if (this.visible !== CycloneMapEditor.active) {
      this.visible = CycloneMapEditor.active;
    }

    if (CycloneMapEditor.active) {
      this.updatePosition();
    }
  }

  updateDrawing() {
    if (CycloneMapEditor.isRightButtonDown) {
      return this.updateRectangle();
    }

    switch (CycloneMapEditor.currentTool) {
      case 'fill':
        return this.updateTiles();
      case 'pencil':
        return this.updateTiles();
      case 'eraser':
        return this.updateEraser();
      case 'rectangle':
        if ((!CycloneMapEditor.rectangleWidth && !CycloneMapEditor.rectangleBackWidth) || (!CycloneMapEditor.rectangleHeight && !CycloneMapEditor.rectangleBackHeight)) {
          this.updateTiles();
          return;
        }

        return this.updateRectangle();
    }
  }

  getNewBitmapWidth() {
    return (CycloneMapEditor.tileWidth * (CycloneMapEditor.rectangleWidth || (CycloneMapEditor.rectangleBackWidth + 1))) || 1;
  }

  getNewBitmapHeight() {
    return (CycloneMapEditor.tileHeight * (CycloneMapEditor.rectangleHeight || (CycloneMapEditor.rectangleBackHeight + 1))) || 1;
  }

  updateRectangle() {
    const width = this.getNewBitmapWidth();
    const height = this.getNewBitmapHeight();

    if (width !== this.bitmap.width || height !== this.bitmap.height) {
      this.bitmap = new Bitmap(width, height);
    } else {
      this.bitmap.clear();
    }

    const fillColor = CycloneMapEditor.isRightButtonDown ? '#00000033' : '#00FF0033';

    if (CycloneMapEditor.currentLayer === 5) {
      this.drawTiles();
    }

    if (width > 8 && height > 8) {
      this.bitmap.fillRect(0, 0, width, 4, '#000000');
      this.bitmap.fillRect(0, height - 4, width, 4, '#000000');
      this.bitmap.fillRect(0, 0, 4, height, '#000000');
      this.bitmap.fillRect(width - 4, 0, 4, height, '#000000');

      this.bitmap.fillRect(2, 2, width - 4, 2, '#FFFFFF');
      this.bitmap.fillRect(2, height - 4, width - 4, 2, '#FFFFFF');
      this.bitmap.fillRect(2, 2, 2, height - 4, '#FFFFFF');
      this.bitmap.fillRect(width - 4, 2, 2, height - 4, '#FFFFFF');

      this.bitmap.fillRect(4, 4, width - 8, height - 8, fillColor);
    } else if (width > 0 && height > 0) {
      this.bitmap.fillRect(0, 0, width, height, fillColor);
    }
  }

  updateEraser() {
    const width = this.getNewBitmapWidth();
    const height = this.getNewBitmapHeight();

    if (width !== this.bitmap.width || height !== this.bitmap.height) {
      this.bitmap = new Bitmap(width, height);
    } else {
      this.bitmap.clear();
    }

    if (width > 8 && height > 8) {
      this.bitmap.fillRect(0, 0, width, 4, '#000000');
      this.bitmap.fillRect(0, height - 4, width, 4, '#000000');
      this.bitmap.fillRect(0, 0, 4, height, '#000000');
      this.bitmap.fillRect(width - 4, 0, 4, height, '#000000');

      this.bitmap.fillRect(2, 2, width - 4, 2, '#FFFFFF');
      this.bitmap.fillRect(2, height - 4, width - 4, 2, '#FFFFFF');
      this.bitmap.fillRect(2, 2, 2, height - 4, '#FFFFFF');
      this.bitmap.fillRect(width - 4, 2, 2, height - 4, '#FFFFFF');

      this.bitmap.fillRect(4, 4, width - 8, height - 8, '#FF000033');
    } else if (width > 0 && height > 0) {
      this.bitmap.fillRect(0, 0, width, height, '#FF000033');
    }
  }

  drawMultiLayerTiles() {
    for (let z = 0; z < CycloneMapEditor.multiLayerSelection.length; z++) {
      let column = 0;
      let row = 0;

      for (const tileId of CycloneMapEditor.multiLayerSelection[z]) {
        if (column >= CycloneMapEditor.tileCols) {
          column = 0;
          row++;
        }

        const x = column * CycloneMapEditor.tileWidth;
        const y = row * CycloneMapEditor.tileHeight;

        this.bitmap.drawTile(tileId, x, y);
        column++;
      }
    }
  }

  drawTiles() {
    if (CycloneMapEditor.currentLayer === Layers.auto && CycloneMapEditor.multiLayerSelection.length) {
      this.drawMultiLayerTiles();
      return;
    }

    let column = 0;
    let row = 0;

    for (const tileId of CycloneMapEditor.selectedTileList) {
      if (column >= CycloneMapEditor.tileCols) {
        column = 0;
        row++;
      }

      const x = column * CycloneMapEditor.tileWidth;
      const y = row * CycloneMapEditor.tileHeight;

      if (CycloneMapEditor.currentLayer === 5) {
        this.bitmap.drawRegion(tileId, x, y);
      } else if (CycloneMapEditor.currentLayer === 4) {
        this.bitmap.drawShadow(tileId, x, y);
      } else {
        this.bitmap.drawTile(tileId, x, y);
      }
      column++;
    }
  }

  updateTiles() {
    const width = CycloneMapEditor.tileWidth * CycloneMapEditor.tileCols;
    const height = CycloneMapEditor.tileHeight * CycloneMapEditor.tileRows;

    if (width !== this.bitmap.width || height !== this.bitmap.height) {
      this.bitmap = new Bitmap(width, height);
    } else {
      this.bitmap.clear();
    }

    this.drawTiles();

    if (width > 8 && height > 8) {
      this.bitmap.fillRect(0, 0, width, 4, '#000000');
      this.bitmap.fillRect(0, height - 4, width, 4, '#000000');
      this.bitmap.fillRect(0, 0, 4, height, '#000000');
      this.bitmap.fillRect(width - 4, 0, 4, height, '#000000');

      this.bitmap.fillRect(2, 2, width - 4, 2, '#FFFFFF');
      this.bitmap.fillRect(2, height - 4, width - 4, 2, '#FFFFFF');
      this.bitmap.fillRect(2, 2, 2, height - 4, '#FFFFFF');
      this.bitmap.fillRect(width - 4, 2, 2, height - 4, '#FFFFFF');
    }
  }

  getCursorTileX() {
    if (CycloneMapEditor.currentTool === 'rectangle' || CycloneMapEditor.currentTool === 'eraser' || CycloneMapEditor.isRightButtonDown) {
      if (CycloneMapEditor.rectangleWidth > 0) {
        return CycloneMapEditor.rectangleStartX;
      }
      if (CycloneMapEditor.rectangleBackWidth > 0) {
        return CycloneMapEditor.rectangleStartX - CycloneMapEditor.rectangleBackWidth;
      }
    }

    if (SceneManager._scene._mapEditorWindow) {
      if (TouchInput.x >= SceneManager._scene._mapEditorWindow.x) {
        return $gameMap.canvasToMapX(SceneManager._scene._mapEditorWindow.x);
      }
    }

    return $gameMap.canvasToMapX(TouchInput.x);
  }

  getCursorTileY() {
    if (CycloneMapEditor.currentTool === 'rectangle' || CycloneMapEditor.currentTool === 'eraser' || CycloneMapEditor.isRightButtonDown) {
      if (CycloneMapEditor.rectangleHeight > 0) {
        return CycloneMapEditor.rectangleStartY;
      }
      if (CycloneMapEditor.rectangleBackHeight > 0) {
        return CycloneMapEditor.rectangleStartY - CycloneMapEditor.rectangleBackHeight;
      }
    }

    return $gameMap.canvasToMapY(TouchInput.y);
  }

  updatePosition() {
    if (!CycloneMapEditor.active) {
      return;
    }

    const tileX = this.getCursorTileX();
    const tileY = this.getCursorTileY();

    this.x = Math.floor($gameMap.adjustX(tileX) * CycloneMapEditor.tileWidth);
    this.y = Math.floor($gameMap.adjustY(tileY) * CycloneMapEditor.tileHeight);
  }
}

CycloneMapEditor.patchClass(Spriteset_Map, $super => class {
  initialize() {
    $super.initialize.call(this);

    this.createMapEditorCursor();
  }

  createMapEditorCursor() {
    this._mapEditorCursor = new SpriteMapEditorCursor();
    this.addChild(this._mapEditorCursor);
  }

  // updatePosition() {
  //   if (!CycloneMapEditor.active) {
  //     return $super.updatePosition.call(this);
  //   }

  //   const scale = $gameMap.zoom ?? { x : 1, y : 1};
  //   const screen = $gameScreen;
  //   this.x = -($gameMap.zoom?.x ?? 1) * (scale.x - 1);
  //   this.y = -($gameMap.zoom?.y ?? 1) * (scale.y - 1);
  //   this.x = this.x + screen.shake();

  //   if (this.scale.x !== scale.x || this.scale.y !== scale.y) {
  //     const sw = Graphics.width / scale.x + this._tilemap._margin * 2;
  //     const sh = Graphics.height / scale.y + this._tilemap._margin * 2;

  //     if (sw !== this._tilemap.width || sh !== this._tilemap.height) {
  //       this._tilemap.width = sw;
  //       this._tilemap.height = sh;
  //       this._tilemap.refresh();
  //     }

  //     this.scale = new PIXI.Point(scale.x, scale.y);
  //     this._weather.scale = new PIXI.Point(1.0 / scale.x,  1.0 / scale.y);
  //     this._parallax.move(this._parallax.x, this._parallax.y, Graphics.width / scale.x, Graphics.height / scale.y);
  //   }

  // }
});

CycloneMapEditor.patchClass(Tilemap, $super => class {
  _readMapData(x, y, z) {
    if (z <= 4 && !CycloneMapEditor.layerVisibility[z]) {
      return 0;
    }

    const tileIndex = CycloneMapEditor.tileIndex(x, y, z);
    if (CycloneMapEditor.previewChanges?.[tileIndex] !== undefined) {
      return CycloneMapEditor.previewChanges[tileIndex];
    }

    return $super._readMapData.call(this, x, y, z);
  }
});

CycloneMapEditor.patchClass(TouchInput, $super => class {
  static _onLeftButtonDown(event) {
    $super._onLeftButtonDown.call(this, event);

    if (SceneManager._scene instanceof Scene_Map) {
      SceneManager._scene.updateMouse();
    }
  }

  static _onMouseMove(event) {
    $super._onMouseMove.call(this, event);

    if (SceneManager._scene instanceof Scene_Map) {
      SceneManager._scene.updateMouse();
      SceneManager._scene.updateRightMouse();
    }
  }

  static _onMouseUp(event) {
    $super._onMouseUp.call(this, event);

    if (SceneManager._scene instanceof Scene_Map) {
      if (event.button === 0) {
        SceneManager._scene.updateMouse();
      } else if (event.button === 2) {
        CycloneMapEditor.isRightButtonDown = false;
        SceneManager._scene.updateRightMouse();
      }
    }
  }

  static _onRightButtonDown(event) {
    $super._onRightButtonDown.call(this, event);

    if (SceneManager._scene instanceof Scene_Map) {
      CycloneMapEditor.isRightButtonDown = true;
      SceneManager._scene.updateRightMouse();
    }
  }
});
})();