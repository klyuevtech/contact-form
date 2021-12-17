import FormFieldsFactory from "./formFieldsFactory.js";

export default class Form {
    selector = '';
    onSubmitHandler = null;
    $node = null;
    fields = [];

    constructor(options) {
        if (options.formSelector) {
            this.selector = options.formSelector;
        }

        if ('function' === typeof options.onSubmitHandler) {
            this.onSubmitHandler = options.onSubmitHandler;
        }

        this.init();
    }

    init() {
        this.findFormNode();
        this.assembleFields();
        if (this.$node && this.onSubmitHandler) {
            this.$node.addEventListener('submit', this.onSubmitHandler);
        }
    }

    findFormNode() {
        const $node = document.querySelector(this.selector);
        if ($node) {
            this.$node = $node;
        }
    }

    assembleFields() {
        if (!this.$node) {
            return;
        }
        const elemTypes = ['input', 'textarea'];
        const nodes = [];

        elemTypes.forEach(elemType => {
            const elems = this.$node.querySelectorAll(elemType);
            if (elems) {
                elems.forEach( elem => nodes.push(elem));
            }
        });

        if (nodes.length > 0) {
            this.fields = FormFieldsFactory.createFormFieldsFromNodes(nodes);
        }
    }

    isValid() {
        if (!Array.isArray(this.fields) || !this.fields.length>0) {
            return true;
        }

        let isValid = true;
        this.fields.forEach(field => {
            if (!field.isValid()) {
                isValid = false;
            }
        });

        return isValid;
    }

    markInvalidFields() {
        if (!Array.isArray(this.fields) || !this.fields.length>0) {
            return;
        }

        this.fields.forEach(field => {
            if (!field.isValid()) {
                field.markAsInvalid();
            }
        });
    }

    getData() {
        const data = {};

        if (this.fields.length > 0) {
            this.fields.forEach(field => Object.assign(
                data,
                {[field.getFieldName()]: {label: field.getFieldLabel(), value: field.getFieldValue()}}
            ));
        }

        return data;
    }

    shade() {
        if (!this.$node) {
            return;
        }

        const button = this.$node.querySelector('button[type="submit"]');
        if (button) {
            button.disabled = true;
        }

        const overlay = document.getElementById('form_overlay');
        if (overlay) {
            overlay.classList.add('overlay-show');
        }
    }

    unShade() {
        if (!this.$node) {
            return;
        }

        const button = this.$node.querySelector('button[type="submit"]');
        if (button) {
            button.disabled = false;
        }

        const overlay = document.getElementById('form_overlay');
        if (overlay) {
            overlay.classList.remove('overlay-show');
        }
    }
}