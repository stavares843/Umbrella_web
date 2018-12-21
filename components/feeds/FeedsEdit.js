import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';

import FeedsEditLocation from './FeedsEditLocation';

const styles = theme => ({
	panel: {
		...theme.mixins.gutters(),
		margin: '.75rem 0',
		paddingTop: theme.spacing.unit * 2,
		paddingBottom: theme.spacing.unit * 2,
	},
	panelTitle: {
		fontSize: '1.5rem',
	},
	panelContent: {
		fontSize: '.875rem',
	},
	changeButtonWrapper: {
		display: 'flex',
		justifyContent: 'flex-end',
	},
	cancelButton: {
		// backgroundColor: theme.palette.
	},
	modal: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
});

const panels = [
	{title: 'Set your feed', content: 'You haven’t set the country and the sources for the feed yet. You have to do it in order for the feed to start displaying, and you can change it any time later in the settings.'},
	{title: 'Interval', content: 'Set how often shall we check for news'},
	{title: 'Location', content: 'Enter location'},
	{title: 'Feed sources', content: 'Set sources'},
];

class FeedsEdit extends React.Component {
	state = {
		modalOpen: false,
		modalContent: null,
	};

	handleChangeClick = (i) => () => {
		let state = {modalOpen: true};

		// set modal inner content
		switch (i) {
			case 0: state.modalContent = <FeedsEditLocation />;
			case 1: state.modalContent = <FeedsEditLocation />;
			case 2: state.modalContent = <FeedsEditLocation />;
			case 3: state.modalContent = <FeedsEditLocation />;
		}

		this.setState(state);
	}

	handleModalClose = () => this.setState({modalOpen: false})

	render() {
		const { classes, toggleEdit } = this.props;

		return (
			<div>
				{panels.map((panel, i) => (
					<Paper key={i} className={classes.panel}>
						<Typography className={classes.panelTitle} variant="h6">{panel.title}</Typography>
						<Typography className={classes.panelContent} paragraph>{panel.content}</Typography>
						<div className={classes.changeButtonWrapper}>
							<Button className={classes.cancelButton} color="secondary" onClick={this.handleChangeClick(i)}>Set</Button>
						</div>
					</Paper>
				))}

				<Button className={classes.cancelButton} variant="contained" onClick={toggleEdit}>Cancel</Button>

				<Modal
					className={classes.modal}
					aria-labelledby="simple-modal-title"
					aria-describedby="simple-modal-description"
					open={this.state.modalOpen}
					onClose={this.handleModalClose}
					disableAutoFocus
				>
					{this.state.modalContent}
				</Modal>
			</div>
		);
	}
}

export default withStyles(styles, {withTheme: true})(FeedsEdit);