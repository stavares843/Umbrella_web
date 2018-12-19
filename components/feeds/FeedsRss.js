import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { contentStyles } from '../../utils/view';

const styles = theme => contentStyles(theme);

class FeedsRss extends React.Component {
	render() {
		return (
			<Typography paragraph>
				<strong>FEEDS RSS</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
				incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent
				elementum facilisis leo vel. Risus at ultrices mi tempus imperdiet. Semper risus in
				hendrerit gravida rutrum quisque non tellus. Convallis convallis tellus id interdum
				velit laoreet id donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing.
				Amet nisl suscipit adipiscing bibendum est ultricies integer quis. Cursus euismod quis
				viverra nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum leo.
				Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis feugiat vivamus
				at augue. At augue eget arcu dictum varius duis at consectetur lorem. Velit sed
				ullamcorper morbi tincidunt. Lorem donec massa sapien faucibus et molestie ac.
			</Typography>
		);
	}
}

export default withStyles(styles, {withTheme: true})(FeedsRss);