import { Fiber } from './babact';

export function createDom(fiber: Fiber) {
	const dom: HTMLElement | Text =
		fiber.tag === 'TEXT_ELEMENT' ?
		document.createTextNode(fiber.props.nodeValue) :
		document.createElement(fiber.tag as string);
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