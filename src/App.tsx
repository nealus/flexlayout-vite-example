import {Layout, Model, TabNode, IJsonModel} from 'flexlayout-react';
import './App.css';
import 'flexlayout-react/style/light.css';

var json : IJsonModel= {
    global: {"tabEnablePopout": true},
    borders: [],
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

  const factory = (node: TabNode) => {
    var component = node.getComponent();
    if (component === "placeholder") {
      return <div className="placeholder">{node.getName()}</div>;
    }
  }

  return (
    <Layout
      model={model}
      factory={factory} />
  );
}

export default App;
