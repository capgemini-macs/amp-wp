/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import edit from './edit';
import blockIcon from '../../../../images/stories-editor/call-to-action.svg';

const schema = {
	postId: {
		type: 'number',
		default: 1,
	},
	title: {
		type: 'string',
	},
	text: {
		type: 'string',
		default: __( 'Swipe Up', 'amp' ),
	},
	theme: {
		type: 'string',
		default: 'light',
	},
	wrapperStyle: {
		default: {},
	},
	attachmentClass: {
		type: 'string',
	},
};

export const name = 'amp/amp-story-page-attachment';

export const settings = {
	title: __( 'Page attachment', 'amp' ),

	description: __( 'Attach additional content to a story page.', 'amp' ),

	icon: blockIcon,

	category: 'layout',

	keywords: [
		__( 'attachment', 'amp' ),
		__( 'content', 'amp' ),
		__( 'embed', 'amp' ),
	],

	attributes: schema,

	edit,

	save() {
		// Dynamic content, handled by PHP.
		return null;
	},
};