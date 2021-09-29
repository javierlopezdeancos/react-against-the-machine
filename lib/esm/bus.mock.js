var BusMock = /** @class */ (function () {
    function BusMock() {
        this.subscriptions = {};
    }
    BusMock.prototype.publish = function (message, data) {
        var handlers = this.subscriptions[message];
        if (handlers) {
            handlers.forEach(function (h) {
                h(message, data);
            });
        }
    };
    BusMock.prototype.subscribe = function (message, trigger) {
        if ((this === null || this === void 0 ? void 0 : this.subscriptions[message]) === undefined) {
            this.subscriptions[message] = [];
        }
        this.subscriptions[message].push(trigger);
    };
    BusMock.prototype.clear = function () {
        this.subscriptions = {};
    };
    return BusMock;
}());
export default BusMock;
export var busMock = new BusMock();
