import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import GameBoard from '../components/GameBoard';

const GameScreen = ({ navigation, route }) => {
  
  const [gameMatrix, setGameMatrix] = useState([]);

  const [selectedTiles, setSelectedTiles] = useState([]);

  const [numberLocked, setNumberLocked] = useState(0);

  useEffect(() => {
    createGameMatrix()
  }, []);

  const createGameMatrix = () => {
    const { rows, columns } = route.params;
    
    const tileValues = createTileValueList();

    let tempMatrix = [];
    for(let i = 0; i < rows; i++){
      let tempRow = [];
      for(let j = 0; j < columns; j++){
        tempRow.push({
          rowNumber: i,
          columnNumber: j,
          selected: false,
          locked: false,
          value: (
            tileValues.pop()
          )
        })
      }
      tempMatrix = [...tempMatrix, tempRow]
    }
    setGameMatrix(tempMatrix);
  } 

  const handleTilePressed = (tileInfo) => {
    const { rowNumber, columnNumber, value } = tileInfo;
    let tempMatrix = gameMatrix;
    let foundMatch = false;
    
    selectedTiles.map((selectedTile, i) => {
      if(selectedTile.value == value) {
        console.log('same')
        foundMatch = true;
        tempMatrix[rowNumber][columnNumber].locked = true;
        tempMatrix[selectedTile.rowNumber][selectedTile.columnNumber].locked = true;
        setNumberLocked(numberLocked+2); // change the +2 when changing to match more than 2
      }
    })

    if((selectedTiles.length == 0) || (!foundMatch && selectedTiles.length + 1 < route.params.numberOfMatches)) {
      tempMatrix[rowNumber][columnNumber].selected = true;
      setSelectedTiles([...selectedTiles, tileInfo])
    } else {
      selectedTiles.map((selectedTile, i) => {
        tempMatrix[selectedTile.rowNumber][selectedTile.columnNumber].selected = false;
      })
      setSelectedTiles([])
    }
  
    setGameMatrix(tempMatrix);
  }

  const createTileValueList = () => {
    const { rows, columns, numberOfMatches } = route.params;

    let tileValues = [];
    for(let i = 0; i < (rows * columns); i++){
      tileValues.push(Math.floor(i % (rows * columns) / numberOfMatches))
    }
    return tileValues.sort( () => .5 - Math.random() ); // uncomment when done
    // return tileValues;
  }

  return (
    <View style={styles.gameContainer}>
      {/* <Text>Difficulty: {route.params.difficulty}</Text> */}
      <Text>Number of Colours to Match: {route.params.numberOfMatches}</Text>
      <GameBoard gameMatrix={gameMatrix} onTilePressed={handleTilePressed}/>
      { numberLocked == route.params.rows * route.params.columns &&
        <Text>You Win!</Text>
      }
    </View>
  );
}

export default GameScreen;
  
const styles = StyleSheet.create({
  gameContainer: {
    flex: 1,
    backgroundColor: '#E3E3E3',
    alignItems: 'center',
    justifyContent: 'center',
  }
})