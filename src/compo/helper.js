function mask_getAnimationModel(animation) {
	return mask_toJSON(animation.nodes);
}

window.maskToJson = mask_toJSON;

function mask_toJSON(node) {

	if (node == null) {
		return null;
	}

	if (node instanceof Array) {
		if (node.length === 1) {
			return mask_toJSON(node[0]);
		}

		var	nodes = node,
			Type = mask_getType(nodes),
			json = new Type();

		for(var i = 0, x, length = nodes.length; i < length; i++){
			x = nodes[i];

			if (Type === Array) {
				json.push(mask_toJSON(x));
				continue;
			}

			if (Type === Object) {
				json[mask_getTagName(x)] = mask_toJSON(x.nodes);
			}
		}

		return json;
	}

	if (mask.Dom.TEXTNODE === node.type) {
		return node.content;
	}

	if (mask.Dom.FRAGMENT === node.type) {
		return mask_toJSON(node.nodes);
	}

	if (mask.Dom.NODE) {

		var result = {};

		result[mask_getTagName(node)] = mask_toJSON(node.nodes);

		return result;
	}

	return null;
}

function mask_getTagName(node) {
	var tagName = node.tagName;

	return tagName.charCodeAt(0) === 64 /* @ */ ? tagName.substring(1) : tagName;
}

function mask_getType(nodes) {
	var keys = {};
	for(var i = 0, x, length = nodes.length; i < length; i++){
		x = nodes[i];
		switch (x.type) {
			case mask.Dom.TEXTNODE:
			case mask.Dom.FRAGMENT:
				return Array;
			case mask.Dom.NODE:
				if (keys[x.tagName] === 1) {
					return Array;
				}
				keys[x.tagName] = 1;
				break;
		}
	}
	return Object;
}
