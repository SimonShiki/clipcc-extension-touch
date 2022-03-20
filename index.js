const { Extension, type, api } = require('clipcc-extension');

function clamp(x, min, max) {
    return x > max ? max : x < min ? min : x;
}

class Touch extends Extension {
    constructor () {
        super();
        this.touches = [];
        this.isReported = false;
    }
    
    get isTouching () {
        return this.touches.length > 0;
    }
    
    onInit () {
        this.stage = api.getStageCanvas() || document.querySelector("*[class*=stage_stage_] canvas");
        this.rect = this.stage.getBoundingClientRect();
        if (!this.stage) {
            alert('Unable to get the stage element, the extension will unavailable.');
            return;
        }
        
        this.stage.addEventListener('touchstart', event => {
            const raw = event.targetTouches;
            let temp = [];
            for (const point of raw) {
                temp.push({
                    x: clamp(
                        Math.round(480 * ((point.clientX - this.rect.left) / this.rect.width - 0.5)),
                        -240,
                        240
                    ),
                    y: clamp(
                        Math.round(-360 * ((point.clientY - this.rect.top) / this.rect.height - 0.5)),
                        -180,
                        180
                    ),
                    force: point.force
                });
            }
            this.touches = temp;
            this.isReported = false;
        });
        this.stage.addEventListener('touchmove', event => {
            const raw = event.targetTouches;
            let temp = [];
            for (const point of raw) {
                temp.push({
                    x: clamp(
                        Math.round(480 * ((point.clientX - this.rect.left) / this.rect.width - 0.5)),
                        -240,
                        240
                    ),
                    y: clamp(
                        Math.round(-360 * ((point.clientY - this.rect.top) / this.rect.height - 0.5)),
                        -180,
                        180
                    ),
                    force: point.force
                });
            }
            this.touches = temp;
            this.isReported = false;
        });
        this.stage.addEventListener('touchcancel', event => {
            this.touches = [];
        });
        this.stage.addEventListener('touchend', event => {
            this.touches = [];
        });
        
        api.addCategory({
            categoryId: 'shiki.touch.category',
            messageId: 'shiki.touch.category',
            color: '#33CCCC'
        });
        api.addBlock({
            opcode: 'shiki.touch.whenstagetouched',
            type: type.BlockType.HAT,
            messageId: 'shiki.touch.whenstagetouched',
            categoryId: 'shiki.touch.category',
            function: () => this.whenStageTouched()
        });
        api.addBlock({
            opcode: 'shiki.touch.whenspritetouched',
            type: type.BlockType.HAT,
            messageId: 'shiki.touch.whenspritetouched',
            categoryId: 'shiki.touch.category',
            function: (args, util) => this.whenSpriteTouched(util)
        });
        api.addBlock({
            opcode: 'shiki.touch.istouching',
            type: type.BlockType.BOOLEAN,
            messageId: 'shiki.touch.istouching',
            categoryId: 'shiki.touch.category',
            function: () => this.isTouching
        });
        api.addBlock({
            opcode: 'shiki.touch.fingers',
            type: type.BlockType.REPORTER,
            messageId: 'shiki.touch.fingers',
            categoryId: 'shiki.touch.category',
            function: () => this.touches.length,
            option: {
                monitor: true
            }
        });
        api.addBlock({
            opcode: 'shiki.touch.touchx',
            type: type.BlockType.REPORTER,
            messageId: 'shiki.touch.touchx',
            categoryId: 'shiki.touch.category',
            function: (args) => {
                if (this.isTouching) return this.touches[args.ID - 1].x;
                return NaN;
            },
            param: {
                ID: {
                    type: type.ParameterType.NUMBER,
					default: 1
                }
            }
        });
        api.addBlock({
            opcode: 'shiki.touch.touchy',
            type: type.BlockType.REPORTER,
            messageId: 'shiki.touch.touchy',
            categoryId: 'shiki.touch.category',
            function: (args) => {
                if (this.isTouching) return this.touches[args.ID - 1].y;
                return NaN;
            },
            param: {
                ID: {
                    type: type.ParameterType.NUMBER,
					default: 1
                }
            }
        });
        api.addBlock({
            opcode: 'shiki.touch.force',
            type: type.BlockType.REPORTER,
            messageId: 'shiki.touch.force',
            categoryId: 'shiki.touch.category',
            function: (args) => {
                if (this.isTouching) return this.touches[args.ID - 1].force;
                return NaN;
            },
            param: {
                ID: {
                    type: type.ParameterType.NUMBER,
                    default: 1
                }
            }
        });
    }

    whenStageTouched() {
        if (this.isTouching && !this.isReported) {
            this.isReported = true;
            return true;
        }
        return false;
    }

    whenSpriteTouched (util) {
        if (this.isTouching && !this.isReported) {
            for (const point of this.touches) {
                const result = util.target.isTouchingPoint(point.x, point.y);
                if (result) {
                    this.isReported = true;
                    return true;
                }
            }
        }
        return false;
    }
    
    onUninit () {
        api.removeCategory('shiki.touch.category');
    }
}

module.exports = Touch;
