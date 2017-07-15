import React from 'react'
import { Link } from 'react-router' //eslint-disable-line
import styled from 'styled-components'
import PropTypes from 'prop-types'

const GradientButtonStyles = styled.div`
  font-size: 16px;
  padding: 10px 30px;
  background: linear-gradient(to right, #00c6ff, #0072ff);
  border-radius: 20px;
  color: #fff;
  cursor: pointer;
  &:hover{
    background: linear-gradient(to right, #00B4E8, #005ED1);
  }
`

const GradientButton = ({ text, clicker }) =>
  <GradientButtonStyles onClick={() => clicker()}>
    {text}
  </GradientButtonStyles>

GradientButton.propTypes = {
  text:PropTypes.string,
  clicker: PropTypes.func
}

export default GradientButton
