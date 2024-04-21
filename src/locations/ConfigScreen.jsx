import React, { useCallback, useState, useEffect } from "react";
import {
  TextInput,
  Button,
  Heading,
  Form,
  Paragraph,
  Flex,
  Subheading,
} from "@contentful/f36-components";
import { css } from "emotion";
import { useSDK } from "@contentful/react-apps-toolkit";
import { HexColorPicker } from "react-colorful";

const ConfigScreen = () => {
  const [parameters, setParameters] = useState({});
  const sdk = useSDK();

  const [color, setColor] = useState(
    sdk.parameters.installation.defaultColor ?? "#aabbcc"
  );

  const onConfigure = useCallback(async () => {
    // Get current the state of EditorInterface and other entities
    // related to this app installation
    const currentState = await sdk.app.getCurrentState();
    return {
      // Parameters to be persisted as the app configuration.
      parameters,
      // In case you don't want to submit any update to app
      // locations, you can just pass the currentState as is
      targetState: currentState,
    };
  }, [parameters, sdk]);

  // Update parameter to have new default color value
  const onDefaultColorChange = (color) => {
    setColor(color);
    setParameters({ ...parameters, defaultColor: color });
  };

  const onDefaultColorChangeText = (e) => {
    setColor(e.target.value);
    setParameters({ ...parameters, defaultColor: e.target.value });
  };

  // Check if given value is a valid color
  const checkDefaultColor = (strColor) => {
    return CSS.supports("color", strColor);
  };

  // Notify user whether their color is valid or not
  const onDefaultColorCheck = () => {
    if (color === "#aabbcc") {
      setParameters({ ...parameters, defaultColor: color });
    }
    if (checkDefaultColor(parameters.defaultColor)) {
      sdk.notifier.success(
        "Valid Color! Please Save Your Changes to Set the New Default Color."
      );
    } else {
      sdk.notifier.error("Invalid Color: " + parameters.defaultColor);
    }
  };

  useEffect(() => {
    // `onConfigure` allows to configure a callback to be
    // invoked when a user attempts to install the app or update
    // its configuration.
    sdk.app.onConfigure(() => onConfigure());
  }, [sdk, onConfigure]);

  useEffect(() => {
    (async () => {
      // Get current parameters of the app.
      // If the app is not installed yet, `parameters` will be `null`.
      const currentParameters = await sdk.app.getParameters();
      if (currentParameters) {
        setParameters(currentParameters);
      }
      // Once preparation has finished, call `setReady` to hide
      // the loading screen and present the app to a user.
      sdk.app.setReady();
    })();
  }, [sdk]);

  return (
    <div
      className={css({
        margin: "80px 15%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      })}
    >
      <Form className={css({ maxWidth: "700px", padding: "20px" })}>
        <Heading>
          About ContrastCanvas: Colored Backgrounds for Your Assets
        </Heading>
        <Paragraph>
          The ContrastCanvas app allows editors to specify which color
          background is used in the field editor for their assets. This can be
          especially helpful if the image is a white svg.
        </Paragraph>
        <hr />
        <Heading>Configuration</Heading>
        <Subheading>Pick a default color:</Subheading>
        <Flex className={css({ alignItems: "flex-end" })}>
          <div
            className={css({
              display: "flex",
              flexDirection: "column",
              marginRight: "10px",
            })}
          >
            <HexColorPicker
              className={css({ marginBottom: "10px" })}
              color={color}
              onChange={onDefaultColorChange}
            />
            <TextInput value={color} onChange={onDefaultColorChangeText} />
          </div>
          <div
            className={css({
              display: "flex",
              flexDirection: "column",
              marginRight: "10px",
            })}
          >
            <div
              className={css({
                marginBottom: "10px",
                width: "200px",
                height: "200px",
                borderRadius: "12px",
                backgroundColor: color,
              })}
            />
            <Button
              disabled={!parameters.defaultColor}
              onClick={onDefaultColorCheck}
            >
              Validate Color
            </Button>
          </div>
        </Flex>
      </Form>
    </div>
  );
};
export default ConfigScreen;
