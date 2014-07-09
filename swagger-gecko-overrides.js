// Overrides help with Trendline, Rag, Comparison and Pie models

SwaggerOperation.prototype.getSampleJSON = function(type, models) {
  var isPrimitive, listType, val;
  listType = this.isListType(type);
  isPrimitive = ((listType != null) && models[listType]) || (models[type] != null) ? false : true;
  val = isPrimitive ? void 0 : (listType != null ? models[listType].createJSONSample() : models[type].createJSONSample());
  if (val) {
    val = listType ? [val] : val;
    if(typeof val == "string")
      return val;
    else if(typeof val === "object") {
      var t = val;
      if(val instanceof Array && val.length > 0) {
        t = val[0];
      }
      if(t.nodeName) {
        var xmlString = new XMLSerializer().serializeToString(t);
        return this.formatXml(xmlString);
      }
      else
        if (models[type].name === 'Trendline') {
          val.item = [{ "text": "", "value": 0 }, [0, 0, 0, 0, 0, 0, 0]]
        }
        if (models[type].name === 'Rag' || models[type].name === 'Comparison' || models[type].name === 'Pie') {
          var arrayItem;
          arrayItem = val.item[0];
          val.item.push(arrayItem);
          if ( models[type].name === 'Rag' ) {
            val.item.push(arrayItem);
          }
        }
        return JSON.stringify(val, null, 2);
    }
    else
      return val;
  }
};

SwaggerModel.prototype.getMockSignature = function(modelsToIgnore) {
  var propertiesStr = [];
  for (var i = 0; i < this.properties.length; i++) {
    prop = this.properties[i];
    if ( prop.refDataType === 'RagItem' ) {
      prop.dataTypeWithRef = 'array[RagItem, RagItem, RagItem]'
    }
    if ( prop.refDataType === 'ComparisonItem' ) {
      prop.dataTypeWithRef = 'array[ComparisonItem, ComparisonItem]'
    }
    if ( prop.refDataType === 'PieItem' ) {
      prop.dataTypeWithRef = 'array[PieItem, PieItem]'
    }
    propertiesStr.push(prop.toString());
  }

  var strong = '<span class="strong">';
  var stronger = '<span class="stronger">';
  var strongClose = '</span>';
  var classOpen = strong + this.name + ' {' + strongClose;
  var classClose = strong + '}' + strongClose;
  var returnVal = classOpen + '<div>' + propertiesStr.join(',</div><div>') + '</div>' + classClose;
  if (!modelsToIgnore)
    modelsToIgnore = [];
  modelsToIgnore.push(this.name);

  for (var i = 0; i < this.properties.length; i++) {
    prop = this.properties[i];
    if ((prop.refModel != null) && modelsToIgnore.indexOf(prop.refModel.name) === -1) {
      returnVal = returnVal + ('<br>' + prop.refModel.getMockSignature(modelsToIgnore));
    }
  }
  return returnVal;
};
