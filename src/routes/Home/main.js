import React from 'react'
import PropTypes from 'prop-types'
import GradientButton from '../../components/gradientbutton'

const Home = ({ showNotifier }) =>
  <div>
    <GradientButton text='Show Toaster' clicker={() => showNotifier()} />
  </div>

Home.propTypes = {
  showNotifier: PropTypes.func
}

export default Home
