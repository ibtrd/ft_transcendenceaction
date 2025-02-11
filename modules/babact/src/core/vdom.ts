export function createElement(tag: String, props: Object, ...children: Array<String | Object>) {
    return {
        tag,
        props: {
            ...props,
            children: children.map(child => {
                return typeof child === 'object' ? child : createTextElement(child);
            })
        }
    }
}


function createTextElement(text: String) {
    return {
        tag: 'TEXT_ELEMENT',
        props: {
            nodeValue: text,
            children: []
        }
    }
}
