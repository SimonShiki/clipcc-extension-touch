const { Extension, type, api } = require('clipcc-extension');
const IO = require('./io');

class Touch extends Extension {
    onInit () {
        this.stage = api.getStageCanvas() || document.querySelector("*[class*=stage_stage_] canvas");
        if (!this.stage) {
            alert('Unable to get the stage element, the extension will unavailable.');
            return;
        }
        this.rect = this.stage.getBoundingClientRect();

        this.IO = new IO(this.rect);

        this.stage.addEventListener('touchstart', (e) => {
            const data = {
                type: 'touchstart',
                targetTouches: e.targetTouches,
                changedTouches: e.changedTouches
            };
            this.IO.postData(data);
        });
        this.stage.addEventListener('touchmove', (e) => {
            const data = {
                type: 'touchmove',
                targetTouches: e.targetTouches,
                changedTouches: e.changedTouches
            };
            this.IO.postData(data);
        });
        this.stage.addEventListener('touchend', (e) => {
            const data = {
                type: 'touchend',
                targetTouches: e.targetTouches,
                changedTouches: e.changedTouches
            };
            this.IO.postData(data);
        });
        
        api.addCategory({
            categoryId: 'shiki.touch.category',
            messageId: 'shiki.touch.category',
            color: '#33CCCC'
        });
        api.addBlock({
            opcode: 'shiki.touch.whenstagepressed',
            type: type.BlockType.HAT,
            messageId: 'shiki.touch.whenstagepressed',
            categoryId: 'shiki.touch.category',
            function: () => {}
        });
        api.addBlock({
            opcode: 'shiki.touch.whenspritepressed',
            type: type.BlockType.HAT,
            messageId: 'shiki.touch.whenspritepressed',
            categoryId: 'shiki.touch.category',
            function: (args, util) => {}
        });
        api.addBlock({
            opcode: 'shiki.touch.ispressing',
            type: type.BlockType.BOOLEAN,
            messageId: 'shiki.touch.ispressing',
            categoryId: 'shiki.touch.category',
            function: () => {
                const points = this.IO.points;
                return points.length > 0;
            }
        });
        api.addBlock({
            opcode: 'shiki.touch.fingers',
            type: type.BlockType.REPORTER,
            messageId: 'shiki.touch.fingers',
            categoryId: 'shiki.touch.category',
            function: () => this.IO.points.length,
            option: {
                monitor: true
            }
        });
        api.addBlock({
            opcode: 'shiki.touch.pointx',
            type: type.BlockType.REPORTER,
            messageId: 'shiki.touch.pointx',
            categoryId: 'shiki.touch.category',
            function: (args) => {
                const point = this.IO.points[args.ID - 1];
                return point ? point._scratchX : 0;
            },
            param: {
                ID: {
                    type: type.ParameterType.NUMBER,
					default: 1
                }
            }
        });
        api.addBlock({
            opcode: 'shiki.touch.pointy',
            type: type.BlockType.REPORTER,
            messageId: 'shiki.touch.pointy',
            categoryId: 'shiki.touch.category',
            function: (args) => {
                const point = this.IO.points[args.ID - 1];
                return point ? point._scratchY : 0;
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
                const point = this.IO.points[args.ID - 1];
                return point ? point.force : 0;
            },
            param: {
                ID: {
                    type: type.ParameterType.NUMBER,
                    default: 1
                }
            }
        });
    }
    
    onUninit () {
        api.removeCategory('shiki.touch.category');
    }
}

module.exports = Touch;
