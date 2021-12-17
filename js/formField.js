export default class FormField {
    $node = null;
    match = '';

    constructor($node) {
        if (this.isElement($node)) {
            this.$node = $node;
            this.$node.fieldObject = this;
        }

        this.init();

        return this;
    }

    init() {
        if (this.$node) {
            this.switchLabel();
            this.assignListeners();
        }
    }

    assignListeners(){
        this.$node.addEventListener('input', event => {
            this.switchLabel();
            this.switchValid(event.target);
        });
    }

    getLabelNode() {
        if (this.$node) {
            const label = this.$node.parentElement.querySelector(`label.label-${this.$node.id}`);
            if (label) {
                return label;
            }
        }

        return null;
    }

    switchLabel() {
        const label = this.getLabelNode();
        if (label) {
            if (this.$node.value) {
                label.classList.add('show');
            } else {
                label.classList.remove('show');
            }
        }
    }

    switchValid($formFieldNode) {
        if (!$formFieldNode.fieldObject || $formFieldNode.fieldObject.isValid()) {
            $formFieldNode.fieldObject.markAsValid();
        } else {
            $formFieldNode.fieldObject.markAsInvalid();
        }
    }

    isElement(obj) {
        try {
            return obj instanceof HTMLElement;
        }
        catch(e){
            return (typeof obj==="object") &&
                (obj.nodeType===1) && (typeof obj.style === "object") &&
                (typeof obj.ownerDocument ==="object");
        }
    }

    getFieldName() {
        if (this.$node) {
            return this.$node.name;
        }

        return '';
    }

    getFieldLabel() {
        const label = this.getLabelNode();
        if (label) {
            return label.textContent;
        }

        return '';
    }

    getFieldValue() {
        if (this.$node) {
            return this.$node.value;
        }

        return '';
    }

    isRequired() {
        if (this.$node) {
            return this.$node.hasAttribute('required');
        }

        return false;
    }

    isValid() {
        let isValid = false;
        const value = this.getFieldValue().trim();

        if ((!value && !this.isRequired())
            || (value && this.validate(value))
        ) {
            isValid = true;
        }

        return isValid;
    }

    validate = (value) => {
        return !this.match
            || this.match.test(value.toLowerCase());
    };

    markAsValid() {
        this.$node.classList.remove('error');
    }

    markAsInvalid() {
        this.$node.classList.add('error');
    }
}

export class TextFormField extends FormField {
    isValid() {
        return true;
    }
}

export class TelFormField extends FormField {
    constructor($node) {
        super($node);

        this.match = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    }
}

export class EmailFormField extends FormField {
    constructor($node) {
        super($node);

        this.match = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    }
}