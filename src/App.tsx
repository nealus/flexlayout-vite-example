import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react';
import { Layout, Model, Actions, DockLocation, AddIcon, TabSetNode, ContextMenuBuilder, showPopupMenu } from 'flexlayout-react';
import type { TabNode, IJsonModel, BorderNode, ITabSetRenderValues, TabGroupNode } from 'flexlayout-react';
import 'flexlayout-react/style/combined.css';
import './App.css';

const json: IJsonModel = {
    global: { 
        "tabEnablePopout": true,
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
    const containerRef = useRef<HTMLDivElement>(null);
    const nextAddIndex = useRef<number>(1);

    const factory = (node: TabNode) => {
        const component = node.getComponent();
        switch (component) {
            case "placeholder":
                return <div className="placeholder">{node.getName()}</div>;
            case "json":
                return <ModelJson model={model}/>;
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
                    className="flexlayout__tab_toolbar_button"
                    onClick={() => {
                        model.doAction(Actions.addTab({
                            component: "placeholder",
                            name: "Added " + nextAddIndex.current++
                        }, node.getId(), DockLocation.CENTER, -1, true));
                    }}
                ><AddIcon/></button>);
        }
    }

    const onContextMenu = (
        node: TabNode | TabSetNode | BorderNode | TabGroupNode,
        event: ReactMouseEvent<HTMLElement, globalThis.MouseEvent>,
    ) => {
        event.preventDefault();
        event.stopPropagation();
        
        const entries = new ContextMenuBuilder(node).addStandard().build();
        if (entries.length === 0) return;

        const container = node.getLayoutRef()!;
        if (!container) return;

        showPopupMenu({
            anchor: { x: event.clientX, y: event.clientY },
            items: entries,
            onClose: () => {},
            container,
        });
    };

    return (
        <div ref={containerRef} className="flexlayout__theme_alpha_light" style={{ position: 'relative', width: '100vw', height: '100vh' }}>
        <Layout
            model={model}
            factory={factory}
            onRenderTabSet={onRenderTabSet}
            onContextMenu={onContextMenu}
            realtimeResize={true}
        />
        </div>
    );
}

// component to show the current model json
function ModelJson({model}:{model: Model}) {
    const [json, setJson] = useState<string>(JSON.stringify(model.toJson(), null, "\t"));
    const timerRef = useRef<number>(0);

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setJson(JSON.stringify(model.toJson(), null, "\t"));
        }, 500);
        return () => { clearInterval(timerRef.current)}
    }, []);

    return (
        <pre>{json}</pre>
    );
}

export default App;
