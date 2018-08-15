import React, { Component } from 'react'
import styled from 'styled-components'
import {colors, fonts } from '../../config/_variables'

class Button extends Component {
    render() {
      return (
        <ButtonThis>
            {this.props.label}
        </ButtonThis>
      );
    }
  }

export default Button

const ButtonThis = styled.button`
  padding: 8px 16px;
  font-family: ${fonts.serif};
  background-color: transparent;
  color: ${colors.gold};
  border: 2px solid ${colors.gold};
  border-radius: 50px;
  font-family: ${fonts.sans};
  font-size: 1rem;
  transition: .5s;
  &:hover {
      background-color: ${colors.gold};
      opacity: .5;
      color
  }
`