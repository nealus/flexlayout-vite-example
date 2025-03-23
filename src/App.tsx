import { Layout, Model, TabNode, IJsonModel, TabSetNode, BorderNode, ITabSetRenderValues, Actions, DockLocation } from 'flexlayout-react';
import './App.css';
import 'flexlayout-react/style/light.css';
import { useRef } from 'react';

var json: IJsonModel = {
    global: { 
        "tabEnablePopout": true,
        "splitterEnableHandle": true,
		"tabSetMinWidth": 130,
		"tabSetMinHeight": 100,
		"borderMinSize": 100,
		"tabSetEnableTabScrollbar": true,
		"borderEnableTabScrollbar": true
    },
    borders: [
        {
            "type": "border",
            "location": "bottom",
            "children": [
                {
                    "type": "tab",
                    "name": "JSON",
                    "component": "json",
                    "enableClose": false,
                },
            ]
        },
    ],
    layout: {
        type: "row",
        weight: 100,
        children: [
            {
                type: "tabset",
                weight: 50,
                children: [
                    {
                        type: "tab",
                        name: "One",
                        component: "placeholder",
                    }
                ]
            },
            {
                type: "tabset",
                weight: 50,
                children: [
                    {
                        type: "tab",
                        name: "Two",
                        component: "placeholder",
                    }
                ]
            }
        ]
    }
};

const model = Model.fromJson(json);

function App() {

    const nextAddIndex = useRef<number>(1);

    const factory = (node: TabNode) => {
        var component = node.getComponent();
        switch (component) {
            case "placeholder":
                return <div className="placeholder">{node.getName()}</div>;
                break;
            case "json":
                return <pre>{JSON.stringify(json, null, "\t")}</pre>;
                break;
            default:
                return <div>{"unknown component " + component}</div>
        }
    }

    const onRenderTabSet = (node: TabSetNode | BorderNode, renderValues: ITabSetRenderValues) => {
        if (node instanceof TabSetNode) {
            renderValues.stickyButtons.push(
                <button
                    key="Add"
                    title="Add"
                    style={{ fontSize: "20px", color: "gray", width: "1em" }}
                    className="flexlayout__tab_toolbar_button"
                    onClick={() => {
                        model.doAction(Actions.addNode({
                            component: "placeholder",
                            name: "Added " + nextAddIndex.current++
                        }, node.getId(), DockLocation.CENTER, -1, true));
                    }}
                >+</button>);
        }
    }

    return (
        <Layout
            model={model}
            factory={factory}
            onRenderTabSet={onRenderTabSet}
            realtimeResize={true}
        />
    );
}

export default App;
