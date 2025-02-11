export function createElement(tag: String, props: Object, ...children) {
    //console.log(tag, props, children);
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

export function createDom(fiber) {
    //console.log("createDom", fiber);
	const dom =
		fiber.tag === 'TEXT_ELEMENT' ?
		document.createTextNode(fiber.props.nodeValue) :
		document.createElement(fiber.tag);
	
	Object.keys(fiber.props)
		.filter(key => key !== 'children')
		.forEach(name => {
            if (name.startsWith('on')) {
                const eventType = name.toLowerCase().substring(2);
                dom.addEventListener(eventType, fiber.props[name]);
            }
            else {
                dom[name] = fiber.props[name];
            }
		}
	);

	return dom;
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
