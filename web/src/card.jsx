import { Component } from 'react'                                                                                                                   

/*
  Render a rounded card with given content
  Apply background color depending on type (success, danger), if set
*/
class Card extends Component {
  render() {
    const type = this.props.type

    let class_name = "card"
    if (type == "success") {
      class_name += " bg-darkgreen text-white"
    } else if (type == "error") {
      class_name += " bg-darkred text-white"
    }

    return (
      <div className={class_name}>
        { this.props.children }
      </div>
    )
  }
}

export { Card }
