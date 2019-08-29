/**
 * WordPress dependencies
 */
import { withDispatch, withSelect } from '@wordpress/data';
import { compose, createHigherOrderComponent } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import { ALLOWED_CHILD_BLOCKS } from '../../constants';
import { render } from '@wordpress/element';
import { RightClickMenu } from '../';

const applyWithSelect = withSelect( ( select ) => {
	const {	isReordering } = select( 'amp/story' );
	return {
		isReordering: isReordering(),
	};
} );

const applyWithDispatch = withDispatch( ( dispatch, ownProps, { select } ) => {
	const {
		getSelectedBlockClientIds,
		hasMultiSelection,
	} = select( 'core/block-editor' );

	const onContextMenu = ( event ) => {
		const selectedBlockClientIds = getSelectedBlockClientIds();

		if ( selectedBlockClientIds.length === 0 ) {
			return;
		}

		// Let's ignore multi-selection for now.
		if ( hasMultiSelection() ) {
			return;
		}

		if ( ! document.getElementById( 'amp-story-right-click-menu' ) ) {
			const editLayout = document.querySelector( '.edit-post-layout' );

			const menuWrapper = document.createElement( 'div' );
			menuWrapper.id = 'amp-story-right-click-menu';

			editLayout.appendChild( menuWrapper );
		}

		render(
			<RightClickMenu clientIds={ selectedBlockClientIds } clientX={ event.clientX } clientY={ event.clientY } />,
			document.getElementById( 'amp-story-right-click-menu' )
		);

		event.preventDefault();
	};

	return {
		onContextMenu,
	};
} );

const enhanced = compose(
	applyWithSelect,
	applyWithDispatch,
);

/**
 * Higher-order component that adds right click handler to each inner block.
 *
 * @return {Function} Higher-order component.
 */
export default createHigherOrderComponent(
	( BlockEdit ) => {
		return enhanced( ( props ) => {
			const { name, onContextMenu, isReordering } = props;
			const isPageBlock = 'amp/amp-story-page' === name;

			// Add for page block and inner blocks.
			if ( ! isPageBlock && ! ALLOWED_CHILD_BLOCKS.includes( name ) ) {
				return <BlockEdit { ...props } />;
			}

			// Not relevant for reordering.
			if ( isReordering ) {
				return <BlockEdit { ...props } />;
			}

			return (
				<div onContextMenu={ onContextMenu }>
					<BlockEdit { ...props } />
				</div>
			);
		} );
	},
	'withRightClickHandler'
);