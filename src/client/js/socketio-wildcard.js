"use strict";

function SocketIOWildcard(Emitter) {
    var emit = Emitter.prototype.emit;

    this.onevent = function (packet) {
        var args = packet.data || [];
        if (packet.id != null) {
            args.push(this.ack(packet.id))
        }
        emit.call(this, '*', packet);
        return emit.apply(this, args)
    }
}

module.exports.SocketIOWildcard = SocketIOWildcard;

SocketIOWildcard.prototype.patch = function (socket) {
    if (socket.onevent !== this.onevent) {
        socket.onevent = this.onevent;
    }
};

