import * as React from "react";

import {
SearchkitComponent,
FacetAccessor,
RefinementListFilter
} from "searchkit"

const Select = require('react-select');
//require('./MultiSelectFilter.css')
const _ = require('lodash');


export default class Select2Filter extends SearchkitComponent<any, any> {
  accessor: FacetAccessor

  constructor() {
    super()
    this.handleChange = this.handleChange.bind(this)
  }

  static defaultProps = {
    size: 200,
    clearable: false
  }

  defineAccessor() {
    const { field, id, operator, title, size, translations } = this.props;
    return new FacetAccessor(field, {
      id, operator, title, size, translations
    })
  }

  defineBEMBlocks() {
    var blockName = this.props.mod || "sk-refinement-list"
    return {
      container: blockName,
      option: `${blockName}-option`
    }
  }

  handleChange(selectedOptions=[]) {
    console.log('selectedOptions', selectedOptions);
    this.accessor.state = this.accessor.state.setValue(selectedOptions.map(o => o.value));
    this.searchkit.performSearch();
  }

  createOption(option) {
    var isChecked = this.accessor.state.contains(option.key)
    var count = option.doc_count
    var label = this.translate(option.key)
    return this.renderOption(label, count, isChecked);
  }

  renderOption(label, count, isChecked) {

    let key = label;
    var className = this.bemBlocks.option()
      .state({ selected: isChecked })
      .mix(this.bemBlocks.container("item"))

    return (
      <option className={className} value={label} key={key}>
        {label} {count ? '(' + count + ')' : null}
        </option>
    )
  }

  render() {
    const { id, placeholder, title, clearable, size } = this.props;
    var block = this.bemBlocks.container
    const buckets = this.accessor.getBuckets()//.slice()
    var className = block()
      .mix(`filter--${id}`)
      .state({
        disabled: buckets.length == 0
      })

    const options = buckets.map((v) => ({ value: v.key, label: v.key + ' (' + v.doc_count + ') ', }))
    return (
      <div className={className}>
        <div className={block("header") }>{title}</div>

        <Select multi disabled={false} value={this.accessor.state.getValue() }
          placeholder={placeholder}
          options={options}
          valueRenderer={(v) => v.value}
          clearable={clearable}
          onChange={this.handleChange} />


        </div>
    );
  }
}