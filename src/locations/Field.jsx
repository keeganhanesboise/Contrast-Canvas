import React, { useEffect } from "react";
import { AssetCard, MenuItem } from "@contentful/f36-components";
import { useSDK } from "@contentful/react-apps-toolkit";
import { SingleMediaEditor } from "@contentful/field-editor-reference";
import { MultipleMediaEditor } from "@contentful/field-editor-reference";

const Field = () => {
  const sdk = useSDK();
  let entry = sdk.entry;
  let field = sdk.field;
  let isMediaList = field.type === "Array";
  let locale = field.locale;

  const imgStyle = {
    backgroundColor: sdk.parameters.installation.defaultColor ?? "white",
  };

  // Adjust the iframe to fit the size of the asset
  useEffect(() => {
    sdk.window.startAutoResizer();
  });

  const handleOpenAsset = (props) => {
    sdk.navigator.openAsset(props.asset.sys.id, {
      slideIn: { waitForClose: true },
    });
  };

  const handleRemoveAsset = (props) => {
    let removedValue = isMediaList
      ? field._value.filter((item) => item.sys.id !== props.asset.sys.id)
      : undefined;
    entry.fields[field.id]._fieldLocales[locale].setValue(removedValue);
  };

  const customRenderer = (props) => {
    let fileIsSet =
      "file" in props.asset.fields && locale in props.asset.fields.file;
    let title = fileIsSet ? props.asset.fields.title[locale] : "";
    let src = fileIsSet ? props.asset.fields.file[locale].url : "";
    return (
      <AssetCard
        actions={[
          <MenuItem key="remove" onClick={() => handleRemoveAsset(props)}>
            Remove
          </MenuItem>,
        ]}
        key={props.asset.sys.id}
        type="image"
        style={imgStyle}
        title={title}
        src={src}
        size="default"
        onClick={() => handleOpenAsset(props)}
      ></AssetCard>
    );
  };

  if (isMediaList) {
    return (
      <MultipleMediaEditor
        key={field._value?.sys?.id}
        hasCardRemoveActions
        sdk={sdk}
        viewType="card"
        parameters={{
          instance: {
            showCreateEntityAction: true,
            showLinkEntityAction: true,
          },
        }}
        renderCustomCard={customRenderer}
      />
    );
  } else {
    return (
      <SingleMediaEditor
        key={field._value?.sys?.id}
        hasCardRemoveActions
        sdk={sdk}
        viewType="card"
        parameters={{
          instance: {
            showCreateEntityAction: true,
            showLinkEntityAction: true,
          },
        }}
        renderCustomCard={customRenderer}
      />
    );
  }
};

export default Field;
