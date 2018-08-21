import React, { Component, Fragment } from 'react'
import TreeNode from './TreeNode'

class Animates extends Component {
  renderItems (anims, texts) {
    const out = []
    Object.entries(texts).forEach(([key, text]) => {
      out.push(<TreeNode
        key={text.id}
        id={text.id}
        name={text.name}
        onClick={this.props.onClick}
        selected={this.props.selected}
      />)
    })
    Object.entries(anims).forEach(([key, anim]) => {
      out.push(<TreeNode
        key={anim.id}
        id={anim.id}
        name={anim.name}
        onClick={this.props.onClick}
        selected={this.props.selected}
      />)
    })
    return out
  }

  renderAnimate (animate) {
    return (
      <TreeNode
        key={animate.id}
        id={animate.id}
        name={animate.name}
        onClick={this.props.onClick}
        selected={this.props.selected}
        collapsable={true} >
        {this.renderItems(animate.anims, animate.texts)}
      </TreeNode>
    )
  }

  renderAnimates () {
    const animates = []
    Object.entries(this.props.animates).forEach(([key, animate]) => {
      animates.push(this.renderAnimate(animate))
    })
    return animates
  }

  render () {
    return <Fragment>
      <TreeNode name='Animate' collapsable={true}>
        {this.renderAnimates()}
      </TreeNode>

    </Fragment>
  }
}

export default Animates