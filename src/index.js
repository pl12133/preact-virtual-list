import { createElement, Component } from 'preact';

const STYLE_INNER = 'position:relative; overflow:hidden; width:100%; min-height:100%;';

const STYLE_CONTENT = 'position:absolute; top:0; left:0; height:100%; width:100%; overflow:visible;';

/** Virtual list, renders only visible items.
 *	@param {Array<*>} data         List of data items
 *	@param {Function} renderRow    Renders a single row
 *	@param {Number} rowHeight      Static height of a row
 *	@param {Number} overscanCount  Amount of rows to render above and below visible area of the list
 *	@param {Boolean} [sync=false]  true forces synchronous rendering
 *	@example
 *		<VirtualList
 *			data={['a', 'b', 'c']}
 *			renderRow={ row => <div>{row}</div> }
 *			rowHeight={22}
 *			sync
 *		/>
 */
export default class VirtualList extends Component {
	focus = (index) => {
		const { start, end } = this.visibleRowRange;
		const { rowHeight } = this.props;
		if (index < start || end < index) {
			// Scroll to index * rowHeight.  This will trigger `handleScroll` which consumes `refocusIndex`.
			this.scrollTop = index * rowHeight;
			this.refocusIndex = index;
		} else {
			const virtualIndex = this.indexToVindex(index);
			const refocus = Array.from(this.base.firstChild.firstChild.childNodes)[virtualIndex];
			if (refocus) { refocus.focus(); }
		}
	}

	indexToVindex = (index) => {
		const { start } = this.visibleRowRange;
		return index - start;
	}
		
	resize = () => {
		if (this.state.height!==this.base.offsetHeight) {
			this.setState({ height: this.base.offsetHeight });
		}
	};

	handleScroll = (e) => {
		const { start: prevStart } = this.visibleRowRange;
		const focusedIndex = Array.from(this.base.firstChild.firstChild.childNodes).indexOf(document.activeElement);

		this.setState({ offset: this.scrollTop }, () => {
			const { start: nextStart } = this.visibleRowRange;
			if (prevStart !== nextStart) {
				const refocusIndex = typeof this.refocusIndex !== 'undefined'
					? this.indexToVindex(this.refocusIndex)
					: prevStart < nextStart
						? focusedIndex - (nextStart - prevStart)
						: focusedIndex + (prevStart - nextStart);

				this.refocusIndex = undefined;
				const refocus = Array.from(this.base.firstChild.firstChild.childNodes)[refocusIndex];
				if (refocus) {
					refocus.focus();
				}
			}
		});
		if (this.props.sync) this.forceUpdate();

		if (this.props.onScroll) {
			this.props.onScroll(e);
		}
	};

	get scrollTop() {
		return this.base && this.base.scrollTop;
	}

	set scrollTop(scrollTop) {
		if (this.base) {
			this.base.scrollTop = scrollTop;
		}
	}

	get visibleRowRange() {
		const { overscanCount = 10, rowHeight } = this.props;
		const { offset = 0, height = 0 } = this.state;

		// first visible row index
		let start = (offset / rowHeight)|0;

		// actual number of visible rows (without overscan)
		let visibleRowCount = (height / rowHeight)|0;

		// Overscan: render blocks of rows modulo an overscan row count
		// This dramatically reduces DOM writes during scrolling
		if (overscanCount) {
			start = Math.max(0, start - (start % overscanCount));
			visibleRowCount += overscanCount;
		}

		// last visible + overscan row index
		let end = start + 1 + visibleRowCount;

		return { start, end, visibleRowCount };
	}

	componentDidUpdate() {
		this.resize();
	}

	componentDidMount() {
		this.resize();
		addEventListener('resize', this.resize);
	}

	componentWillUnmount() {
		removeEventListener('resize', this.resize);
	}

	render({ data, rowHeight, renderRow, overscanCount=10, sync, ...props }, { offset=0, height=0 }) {
		const { start, end } = this.visibleRowRange;

		// data slice currently in viewport plus overscan items
		const selection = data.slice(start, end);

		return (
			<div {...props} onScroll={this.handleScroll}>
				<div style={`${STYLE_INNER} height:${data.length*rowHeight}px;`}>
					<div style={`${STYLE_CONTENT} top:${start*rowHeight}px;`}>
						{ selection.map((row, index) => renderRow(row, start + index, data)) }
					</div>
				</div>
			</div>
		);
	}
}
