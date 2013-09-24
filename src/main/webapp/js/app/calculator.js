/**
 * George Frick (goerge.frick@gmail.com)
 * @brewcitycoder
 * May be freely distributed under the MIT license.
 *
 * A calculator module that doesn't use a Backbone model.
 */
define([ 'handlebars', 'backbone'], function(){
    "use strict";

    // Make the calculator a reusable Math style object.
    var Calculator = function() {
        this.currentValue = '';
        this.Accumulate = 0;
        this.FlagNewNum = false;
        this.xxPendingOp = "";
        return this;
    };

    Calculator.prototype.GetValue = function() {
        return this.currentValue;
    }

    Calculator.prototype.NumPressed = function(Num) {
        if (this.FlagNewNum) {
            this.currentValue = Num + '';
            this.FlagNewNum = false;
        } else {
            if (this.currentValue === "0") {
                this.currentValue = Num;
            } else {
                this.currentValue += Num;
            }
        }
    }

    Calculator.prototype.Operation = function(Op) {
        var Readout = this.currentValue;
        if (this.FlagNewNum && this.xxPendingOp !== "=");
        else {
            this.FlagNewNum = true;
            if ( '+' === this.xxPendingOp ) {
                this.Accumulate += parseFloat(Readout);
            } else if ( '-' === this.xxPendingOp ) {
                this.Accumulate -= parseFloat(Readout);
            } else if ( '/' === this.xxPendingOp ) {
                this.Accumulate /= parseFloat(Readout);
            } else if ( "*" === this.xxPendingOp ) {
                this.Accumulate *= parseFloat(Readout);
            } else {
                this.Accumulate = parseFloat(Readout);
            }
            this.currentValue = this.Accumulate;
            this.xxPendingOp = Op;
        }
    }

    Calculator.prototype.Decimal = function() {
        var curReadOut = this.currentValue;
        if (this.FlagNewNum) {
            curReadOut = "0.";
            this.FlagNewNum = false;
        } else {
            if (curReadOut.indexOf(".") === -1)
                curReadOut += ".";
        }
        this.currentValue = curReadOut;
    }

    Calculator.prototype.ClearEntry = function() {
        this.currentValue = "0";
        this.FlagNewNum = true;
    }

    Calculator.prototype.Clear = function() {
        this.Accumulate = 0;
        this.xxPendingOp = "";
        this.ClearEntry();
    }

    Calculator.prototype.Neg = function() {
        this.currentValue = parseFloat(this.currentValue) * -1;
    }

    Calculator.prototype.Percent = function() {
        this.currentValue = (parseFloat(this.currentValue) / 100) * parseFloat(this.Accumulate);
    }


    Calculator.CalculatorView = Backbone.View.extend({
        initialize: function() {
            this.template = Handlebars.loadTemplate('calculator');
            this.calculator = new Calculator();
        },
        events: {
            "click .btnClear" : 'clearCalc',
            "click .btnClearEntry" : 'clearCalcEntry',
            "click .btnNeg" : 'calcNeg',
            "click .btnPercent" : 'calcPercent',
            "click .btnDecimal" : 'calcDecimal',
            "click .numInput": 'numPressed',
            "click .opInput": 'opPressed'
        },
        calcNeg : function(e) {
            e.preventDefault();
            this.calculator.Neg();
            this.renderVal();
        },
        calcPercent : function(e) {
            e.preventDefault();
            this.calculator.Percent();
            this.renderVal();
        },
        calcDecimal : function(e) {
            e.preventDefault();
            this.calculator.Decimal();
            this.renderVal();
        },
        numPressed : function(e) {
            e.preventDefault();
            this.calculator.NumPressed( $(e.currentTarget).val());
            this.renderVal();
        },
        opPressed : function(e) {
            e.preventDefault();
            this.calculator.Operation( $(e.currentTarget).val());
            this.renderVal();
        },
        clearCalc : function(e) {
            e.preventDefault();
            this.calculator.Clear();
            this.renderVal();
        },
        clearCalcEntry : function(e) {
            e.preventDefault();
            this.calculator.ClearEntry();
            this.renderVal();
        },
        renderVal: function() {
            this.$el.find("input[name='ReadOut']").val(this.calculator.GetValue());
        },
        render: function() {
            this.$el.html(this.template(this));
            this.renderVal();
            return this;
        }
    });

    return Calculator;
});
