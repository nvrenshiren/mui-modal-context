"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var material_1 = require("@mui/material");
var HookModal = function (_a, ref) {
    var config = _a.config, afterClose = _a.afterClose;
    var _b = (0, react_1.useState)(true), visible = _b[0], setVisible = _b[1];
    var _c = (0, react_1.useState)(config), innerConfig = _c[0], setInnerConfig = _c[1];
    var close = (0, react_1.useCallback)(function () {
        var _a;
        var endTime = typeof innerConfig.transitionDuration === 'number'
            ? innerConfig.transitionDuration
            : ((_a = innerConfig.transitionDuration) === null || _a === void 0 ? void 0 : _a.exit) || 0;
        setVisible(false);
        setTimeout(function () {
            !!afterClose && afterClose();
        }, endTime);
    }, [afterClose, innerConfig]);
    (0, react_1.useImperativeHandle)(ref, function () { return ({
        destroy: close,
        update: function (newConfig) {
            setInnerConfig(function (originConfig) { return (__assign(__assign({}, originConfig), newConfig)); });
        }
    }); });
    return react_1.default.createElement(material_1.Dialog, __assign({}, innerConfig, { onClose: close, open: visible }));
};
exports.default = (0, react_1.forwardRef)(HookModal);
