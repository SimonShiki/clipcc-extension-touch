const { Extension, type, api } = require('clipcc-extension');

class Touch extends Extension {
    constructor () {
        super();
        this.touches = [];
    }
    
    get isTouching () {
        return this.touches.length > 0;
    }
    
    onInit () {
        this.stage = api.getStageCanvas() || document.querySelector("*[class*=stage_stage_] canvas");
        if (!this.stage) {
            alert('Unable to get the stage element, the extension will unavailable.');
            return;
        }
        
        this.stage.addEventListener('touchstart', event => {
            this.touches = event.targetTouches;
        });
        this.stage.addEventListener('touchmove', event => {
            this.touches = event.targetTouches;
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
            function: () => {
                if (this.isTouching) {
                    return true;
                }
                return false;
            }
        });
        api.addBlock({
            opcode: 'shiki.touch.whenspritetouched',
            type: type.BlockType.HAT,
            messageId: 'shiki.touch.whenspritetouched',
            categoryId: 'shiki.touch.category',
            function: (args, util) => {
                if (this.isTouching) {
                    for (const point in this.touches){
					    const result = util.target.isTouchingPoint(point.clientX, point.clientY);
						if(result){
					        return true;
					    }
				    }
                }
                return false;
            }
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
                if (this.isTouching) return this.touches[args.ID + 1].clientX;
                return NaN;
            },
            param: {
                ID: {
                    type: type.ParameterType.NUMBER,
					default: 1
                }
            },
            option: {
                monitor: true
            }
        });
        api.addBlock({
            opcode: 'shiki.touch.touchy',
            type: type.BlockType.REPORTER,
            messageId: 'shiki.touch.touchy',
            categoryId: 'shiki.touch.category',
            function: (args) => {
                if (this.isTouching) return this.touches[args.ID + 1].clientY;
                return NaN;
            },
            param: {
                ID: {
                    type: type.ParameterType.NUMBER,
					default: 1
                }
            },
            option: {
                monitor: true
            }
        });
    }
    
    onUninit () {
        api.removeCategory('shiki.touch.category');
    }
}

module.exports = Touch;
