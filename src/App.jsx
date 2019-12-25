import React, { Component } from "react";

var Pokedex = require("pokedex-promise-v2");
var P = new Pokedex();

class ShowPokemon extends Component {
  render = () => {
    return (
      <div>
        <h2>{this.props.name}</h2>
        {this.props.renderOrNo()}
        {this.props.renderDataOrNo()}
      </div>
    );
  };
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      img: "",
      showAll: false,
      input: null,
      success: false,
      error: false,
      type: null,
      weakness: null,
      resistance: null,
      noDamage: null
    };
  }
  getPokemonName = async event => {
    event.preventDefault();
    if (!this.state.input) return;

    P.getPokemonByName(this.state.input) // with Promise
      .then(response => {
        console.log("the response: ", response);
        let type = response.types.map(obj => {
          return obj.type.name;
        });
        console.log("speed:", response.stats[0].base_stat);
        this.getPokemonType(type);
        this.setState({
          img: response.sprites.front_default,
          success: true,
          type: type,
          name: response.species.name,
          speed: response.stats[0].base_stat,
          spd: response.stats[1].base_stat,
          spa: response.stats[2].base_stat,
          def: response.stats[3].base_stat,
          atk: response.stats[4].base_stat,
          hp: response.stats[5].base_stat,
          superWeak: null,
          speedEV: response.stats[0].effort,
          spdEV: response.stats[1].effort,
          spaEV: response.stats[2].effort,
          defEV: response.stats[3].effort,
          atkEV: response.stats[4].effort,
          hpEV: response.stats[5].effort
        });
      })
      .catch(error => {
        console.log("There was an ERROR: ", error);
        this.setState({ error: true });
      });
  };

  addType = () => {
    P.getTypeByName(
      this.state.type.map(type => {
        return type;
      })
    )
      .then(response => {
        console.log(
          "type response:",
          response.damage_relations.double_damage_from.name
        );
        return response.damage_relations.double_damage_from.name;
      })
      .catch(error => {
        console.log("There was an ERROR: ", error);
      });
  };

  getPokemonType = types => {
    let obj1 = {};
    let obj2 = {};
    let superWeak = [];
    let superRes = [];
    let weakness4 = [];
    let resistance4 = [];
    let obj1Arr = [];
    let obj2Arr = [];
    let normalizeArr = [];

    let norm1 = {};
    let norm2 = {};
    P.getTypeByName(
      types.map(type => {
        return type;
      })
    )
      .then(response => {
        let weakness = response.map(obj => {
          //weakness is an array of array(s)
          return obj.damage_relations.double_damage_from.map(name => {
            return name.name;
          });
        });
        let weakness2 = weakness[0].concat(weakness[1]);
        console.log("dfsgseg", weakness2);

        let weakness3 = weakness2.map(type => {
          //!obj1[type] ? (obj1[type] = true) : superWeak.push(type);

          if (!obj1[type]) {
            obj1[type] = true;
            obj1Arr.push(type);
          } else if (obj1[type]) superWeak.push(type);
        });

        console.log("obj1", obj1Arr);

        //console.log("weaknessfilter", weaknessFilter);
        console.log("weakness4", weakness4);

        let resistance = response.map(obj => {
          return obj.damage_relations.half_damage_from.map(name => {
            return name.name;
          });
        });
        let resistance2 = resistance[0].concat(resistance[1]);

        let resistance3 = resistance2.map(type => {
          //!obj2[type] ? (obj2[type] = true) : superRes.push(type);

          if (!obj2[type]) {
            obj2[type] = true;
            obj2Arr.push(type);
          } else if (obj2[type]) superRes.push(type);
        });

        let noDamage = response.map(obj => {
          return obj.damage_relations.no_damage_from.map(name => {
            return name.name;
          });
        });
        let noDamage2 = noDamage[0].concat(noDamage[1]);

        superWeak.map(type => {
          if (obj1Arr.includes(type)) {
            if (obj1Arr.indexOf(type) !== -1) {
              obj1Arr.splice(obj1Arr.indexOf(type), 1);
            }
            return;
          }
          return;
          //obj1Arr.includes(type) ? obj1Arr.indexOf(type) !== 1 : "";
        });

        superRes.map(type => {
          if (obj2Arr.includes(type)) {
            if (obj2Arr.indexOf(type) !== -1) {
              obj2Arr.splice(obj2Arr.indexOf(type), 1);
            }
            return;
          }
          return;
          //obj1Arr.includes(type) ? obj1Arr.indexOf(type) !== 1 : "";
        });

        let newWeakness = obj1Arr.filter(val => !obj2Arr.includes(val));
        let newWeakness2 = newWeakness.filter(val => !noDamage2.includes(val));
        let newResistance = obj2Arr.filter(val => !obj1Arr.includes(val));
        let newResistance2 = newResistance.filter(
          val => !noDamage2.includes(val)
        );

        /*let normalize = obj1Arr.concat(obj2Arr)
        let normalizeArr = normalize.map(type => {
            //!obj2[type] ? (obj2[type] = true) : superRes.push(type);
  
            if (!norm1[type]) {
              norm1[type] = true;
              normalizeArr.push(type);
            } else if (norm1[type]) superRes.push(type);
          });*/

        console.log("newWeakness2", newResistance2);
        console.log("new resistancees", newResistance);
        console.log("noDmges", noDamage2);
        this.setState({
          weakness: newWeakness2,
          resistance: newResistance2,
          noDamage: noDamage2,
          superWeak: superWeak,
          superRes: superRes
        });
      })
      .catch(error => {
        console.log("There was an ERROR: ", error);
      });
  };

  onChangeHandler = event => {
    console.log(event.target.value);
    this.setState({
      input: event.target.value.toLowerCase(),
      success: false,
      error: false,
      showAll: false,
      name: null
    });
  };

  renderOrNo = () => {
    let renderOrNo = <div>No Pokemon Selected...</div>;
    if (this.state.input && !this.state.success && !this.state.error) {
      renderOrNo = <div>Awaiting...</div>;
    } else if (this.state.input && this.state.success && !this.state.error) {
      renderOrNo = <img src={!this.state.img ? "" : this.state.img} />;
    } else if (this.state.input && this.state.error) {
      renderOrNo = <div>{this.state.input} is not a valid Pokemon :( </div>;
    }
    return renderOrNo;
  };

  renderDataOrNo = () => {
    let renderDataOrNo = null;
    if (this.state.success && !this.state.type) {
      renderDataOrNo = <div>Loading...</div>;
    } else if (this.state.success && this.state.type) {
      renderDataOrNo = (
        <div>
          <div>
            <b>Type:</b>
            {this.state.type.map(type => {
              return <div>{type}</div>;
            })}
          </div>
          <div>
            <b>4x weak against:</b>

            {!this.state.superWeak ? (
              ""
            ) : !this.state.superWeak[0] ? (
              <div>N/A</div>
            ) : (
              this.state.superWeak.map(type => {
                return <div>{type}</div>;
              })
            )}
          </div>
          <div>
            <b>Weak against:</b>

            {!this.state.weakness ? (
              ""
            ) : !this.state.weakness[0] ? (
              <div>N/A</div>
            ) : (
              this.state.weakness.map(type => {
                return <div>{type}</div>;
              })
            )}
          </div>

          <div>
            <b>4x resistance against:</b>
            {!this.state.superRes ? (
              ""
            ) : !this.state.superRes[0] ? (
              <div>N/A</div>
            ) : (
              this.state.superRes.map(type => {
                return <div>{type}</div>;
              })
            )}
          </div>

          <div>
            <b>Resistance against:</b>
            {!this.state.resistance ? (
              ""
            ) : !this.state.resistance[0] ? (
              <div>N/A</div>
            ) : (
              this.state.resistance.map(type => {
                return <div>{type}</div>;
              })
            )}
          </div>

          <div>
            <b>No damage against:</b>
            {!this.state.noDamage ? (
              ""
            ) : !this.state.noDamage[0] ? (
              <div>N/A</div>
            ) : (
              this.state.noDamage.map(type => {
                return <div>{type} </div>;
              })
            )}
          </div>
          <div>
            <b>Base Stats:</b>
            <div>
              <b>Speed</b>
              <div>{this.state.speed}</div>
            </div>
            <div>
              <b>Sp. Defense</b>
              <div>{this.state.spd}</div>
            </div>
            <div>
              <b>Sp. Attack</b>
              <div>{this.state.spa}</div>
            </div>
            <div>
              <b>Defense</b>
              <div>{this.state.def}</div>
            </div>
            <div>
              <b>Attack</b>
              <div>{this.state.atk}</div>
            </div>
            <div>
              <b>HP</b>
              <div>{this.state.hp}</div>
            </div>
          </div>
          <div>
            <b>EVs</b>
            {this.state.speedEV === 0 ? (
              ""
            ) : (
              <div>Speed: {this.state.speedEV}</div>
            )}
            {this.state.spdEV === 0 ? (
              ""
            ) : (
              <div>Sp. Defense: {this.state.spdEV}</div>
            )}
            {this.state.spaEV === 0 ? (
              ""
            ) : (
              <div>Sp. Attack: {this.state.spaEV}</div>
            )}
            {this.state.defEV === 0 ? (
              ""
            ) : (
              <div>Defense: {this.state.defEV}</div>
            )}
            {this.state.atkEV === 0 ? (
              ""
            ) : (
              <div>Attack: {this.state.atkEV}</div>
            )}
            {this.state.hpEV === 0 ? "" : <div>HP: {this.state.hpEV}</div>}
          </div>
        </div>
      );
    }
    return renderDataOrNo;
  };

  render = () => {
    return (
      <div>
        <div>
          <h2>Hello World</h2>
          <form onSubmit={this.getPokemonName}>
            <input type="text" onChange={this.onChangeHandler} />
            <input type="submit" value="Submit" />
          </form>
        </div>
        <ShowPokemon
          renderOrNo={this.renderOrNo}
          renderDataOrNo={this.renderDataOrNo}
          name={this.state.name}
        />
      </div>
    );
  };
}

export default App;
