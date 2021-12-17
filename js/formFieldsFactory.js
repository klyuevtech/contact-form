import FormField, {TextFormField, TelFormField, EmailFormField} from "./formField.js";

export default class FormFieldsFactory {
    static createFormFieldsFromNodes(nodes) {
        const fields = [];

        if (Array.isArray(nodes) && nodes.length > 0) {
            nodes.forEach($node => {
                const field = this.createFormFieldFromNode($node);

                if (field instanceof FormField) {
                    fields.push(field);
                }
            });
        }

        return fields;
    }

    static createFormFieldFromNode($node) {
        switch ($node.type) {
            case 'text':
                return new TextFormField($node);
                break;
            case 'tel':
                return new TelFormField($node);
                break;
            case 'email':
                return new EmailFormField($node);
                break;
            default:
                return new FormField($node);
        }
    }
}