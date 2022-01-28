var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import React, { createRef, forwardRef, memo, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import HookModal from './modal.hook';
var usePatchElement = function () {
    var _a = useState([]), elements = _a[0], setElements = _a[1];
    var patchElement = useCallback(function (element) {
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
var ElementsHolder = memo(forwardRef(function (props, ref) {
    var _a = usePatchElement(), elements = _a[0], patchElement = _a[1];
    useImperativeHandle(ref, function () { return ({
        patchElement: patchElement
    }); }, []);
    return React.createElement(React.Fragment, null, elements);
}));
export function useModal() {
    var holderRef = useRef(null);
    var _a = useState([]), actionQueue = _a[0], setActionQueue = _a[1];
    useEffect(function () {
        if (actionQueue.length) {
            var cloneQueue = __spreadArray([], actionQueue, true);
            cloneQueue.forEach(function (action) {
                action();
            });
            setActionQueue([]);
        }
    }, [actionQueue]);
    var getModalFunc = useCallback(function () { return function (config) {
        var _a;
        uuid += 1;
        var modalRef = createRef();
        var closeFunc;
        var modal = (React.createElement(HookModal, { key: "modal-".concat(uuid), config: config, ref: modalRef, afterClose: function () {
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
    var fns = useMemo(function () { return getModalFunc(); }, []);
    return [fns, React.createElement(ElementsHolder, { ref: holderRef })];
}
