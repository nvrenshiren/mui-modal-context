"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useModal = void 0;
var react_1 = __importStar(require("react"));
var modal_hook_1 = __importDefault(require("./modal.hook"));
var usePatchElement = function () {
    var _a = (0, react_1.useState)([]), elements = _a[0], setElements = _a[1];
    var patchElement = (0, react_1.useCallback)(function (element) {
        setElements(function (originElements) { return __spreadArray(__spreadArray([], originElements, true), [element], false); });
        return function () {
            setElements(function (originElements) {
                return originElements.filter(function (ele) { return ele !== element; });
            });
        };
    }, []);
    return [elements, patchElement];
};
var uuid = 0;
var ElementsHolder = (0, react_1.memo)((0, react_1.forwardRef)(function (props, ref) {
    var _a = usePatchElement(), elements = _a[0], patchElement = _a[1];
    (0, react_1.useImperativeHandle)(ref, function () { return ({
        patchElement: patchElement
    }); }, []);
    return react_1.default.createElement(react_1.default.Fragment, null, elements);
}));
function useModal() {
    var holderRef = (0, react_1.useRef)(null);
    var _a = (0, react_1.useState)([]), actionQueue = _a[0], setActionQueue = _a[1];
    (0, react_1.useEffect)(function () {
        if (actionQueue.length) {
            var cloneQueue = __spreadArray([], actionQueue, true);
            cloneQueue.forEach(function (action) {
                action();
            });
            setActionQueue([]);
        }
    }, [actionQueue]);
    var getModalFunc = (0, react_1.useCallback)(function () { return function (config) {
        var _a;
        uuid += 1;
        var modalRef = (0, react_1.createRef)();
        var closeFunc;
        var modal = (react_1.default.createElement(modal_hook_1.default, { key: "modal-".concat(uuid), config: config, ref: modalRef, afterClose: function () {
                closeFunc();
            } }));
        closeFunc = (_a = holderRef.current) === null || _a === void 0 ? void 0 : _a.patchElement(modal);
        return {
            destroy: function () {
                function destroyAction() {
                    var _a;
                    (_a = modalRef.current) === null || _a === void 0 ? void 0 : _a.destroy();
                }
                if (modalRef.current) {
                    destroyAction();
                }
                else {
                    setActionQueue(function (prev) { return __spreadArray(__spreadArray([], prev, true), [destroyAction], false); });
                }
            },
            update: function (newConfig) {
                function updateAction() {
                    var _a;
                    (_a = modalRef.current) === null || _a === void 0 ? void 0 : _a.update(newConfig);
                }
                if (modalRef.current) {
                    updateAction();
                }
                else {
                    setActionQueue(function (prev) { return __spreadArray(__spreadArray([], prev, true), [updateAction], false); });
                }
            }
        };
    }; }, []);
    var fns = (0, react_1.useMemo)(function () { return getModalFunc(); }, []);
    return [fns, react_1.default.createElement(ElementsHolder, { ref: holderRef })];
}
exports.useModal = useModal;
