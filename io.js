/**
 * @fileoverview 用于处理触屏数据，并尽量遵循 scratch-vm 的 IO 定义。
 */
const { api } = require('clipcc-extension');
window.touchdebug = false;

class IO {
    constructor (rect) {
        /**
         * Save every points to this array.
         * @type {Array[object]}
         */
        this.points = [];
        /**
         * Reference to the owning Runtime.
         * Can be used, for example, to activate hats.
         * @type{!Runtime}
         */
        this.runtime = api.getVmInstance().runtime;

        /**
         * The bounding rectangle of the stage.
         * @type {object}
         */
        this.rect = rect;
    }

    /**
    * Clamp a number between two limits.
    * If n < min, return min. If n > max, return max. Else, return n.
    * @param {!number} n Number to clamp.
    * @param {!number} min Minimum limit.
    * @param {!number} max Maximum limit.
    * @return {!number} Value of n clamped to min and max.
    */
    static clamp(n, min, max) {
        return Math.min(Math.max(n, min), max);
    }

    /**
     * Activate "event_whenthisspritepressed" hats.
     * @param  {Target} target to trigger hats on.
     * @private
     */
    _activateClickHats (target) {
        // Activate both "this sprite pressed" and "stage pressed"
        // They were separated into two opcodes for labeling,
        // but should act the same way.
        // Intentionally not checking isStage to make it work when sharing blocks.
        // @todo the blocks should be converted from one to another when shared
        this.runtime.startHats('shiki.touch.whenspritepressed',
            null, target);
        this.runtime.startHats('shiki.touch.whenstagepressed',
            null, target);
    }

    /**
     * Find a target by XY location
     * @param  {number} x X position to be sent to the renderer.
     * @param  {number} y Y position to be sent to the renderer.
     * @return {Target} the target at that location
     * @private
     */
    _pickTarget (x, y) {
        if (this.runtime.renderer) {
            const drawableID = this.runtime.renderer.pick(x, y);
            for (let i = 0; i < this.runtime.targets.length; i++) {
                const target = this.runtime.targets[i];
                if (target.hasOwnProperty('drawableID') &&
                    target.drawableID === drawableID) {
                    return target;
                }
            }
        }
        // Return the stage if no target was found
        return this.runtime.getTargetForStage();
    }

    /**
     * DOM event handler.
     * @param  {object} data Data from DOM event.
     */
    postData (data) {
        switch (data.type) {
            case 'touchstart': {
                const points = Array.from(data.targetTouches);
                const currentPoints = [];
                for (const point of points) {
                    const picked = this._pickTarget(point.clientX, point.clientY);
                    currentPoints.push({
                        _clientX: point.clientX,
                        _clientY: point.clientY,
                        _scratchX: Math.round(IO.clamp(
                            480 * (((point.clientX - this.rect.left) / this.rect.width) - 0.5),
                            -240,
                            240
                        )),
                        _scratchY: 0 - Math.round(IO.clamp(
                            360 * (((point.clientY - this.rect.top) / this.rect.height) - 0.5),
                            -180,
                            180
                        )),
                        isDown: true,
                        force: point.force,
                        target: picked
                    });
                    this._activateClickHats(picked);
                }
                if (window.touchdebug) console.log(currentPoints);
                this.points = currentPoints;
                this._activateClickHats(target);
                break;
            }
            case 'touchmove': {
                const points = Array.from(data.targetTouches);
                const currentPoints = [];
                for (const point of points) {
                    const picked = this._pickTarget(point.clientX, point.clientY);
                    currentPoints.push({
                        _clientX: point.clientX,
                        _clientY: point.clientY,
                        _scratchX: Math.round(IO.clamp(
                            480 * (((point.clientX - this.rect.left) / this.rect.width) - 0.5),
                            -240,
                            240
                        )),
                        _scratchY: 0 - Math.round(IO.clamp(
                            360 * (((point.clientY - this.rect.top) / this.rect.height) - 0.5),
                            -180,
                            180
                        )),
                        isDown: true,
                        force: point.force,
                        target: picked
                    });
                    this._activateClickHats(picked);
                }
                if (window.touchdebug) console.log(currentPoints);
                this.points = currentPoints;
                break;
            }
            case 'touchend': {
                const points = Array.from(data.targetTouches);
                const currentPoints = [];
                for (const point of points) {
                    const picked = this._pickTarget(point.clientX, point.clientY);
                    currentPoints.push({
                        _clientX: point.clientX,
                        _clientY: point.clientY,
                        _scratchX: Math.round(IO.clamp(
                            480 * (((point.clientX - this.rect.left) / this.rect.width) - 0.5),
                            -240,
                            240
                        )),
                        _scratchY: 0 - Math.round(IO.clamp(
                            360 * (((point.clientY - this.rect.top) / this.rect.height) - 0.5),
                            -180,
                            180
                        )),
                        isDown: false,
                        force: point.force,
                        target: picked
                    });
                    this._activateClickHats(picked);
                }
                if (window.touchdebug) console.log(currentPoints);
                this.points = currentPoints;
                break;
            }
            case 'touchcancel': {
                const points = Array.from(data.targetTouches);
                const currentPoints = [];
                for (const point of points) {
                    const picked = this._pickTarget(point.clientX, point.clientY);
                    currentPoints.push({
                        _clientX: point.clientX,
                        _clientY: point.clientY,
                        _scratchX: Math.round(IO.clamp(
                            480 * (((point.clientX - this.rect.left) / this.rect.width) - 0.5),
                            -240,
                            240
                        )),
                        _scratchY: 0 - Math.round(IO.clamp(
                            360 * (((point.clientY - this.rect.top) / this.rect.height) - 0.5),
                            -180,
                            180
                        )),
                        isDown: false,
                        force: point.force,
                        target: picked
                    });
                    this._activateClickHats(picked);
                }
                if (window.touchdebug) console.log(currentPoints);
                this.points = currentPoints;
                break;
            }
            default: {
                console.error('Unknown event type: ' + data.type);
            }
        }
    }
}

module.exports = IO;