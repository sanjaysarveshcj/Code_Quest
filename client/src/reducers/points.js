const pointsReducer = (state = {points : 0}, action) => {
  switch (action.type) {
      case 'FETCH_ALL_POINTS':
          return { ...state, points: action?.payload }
      default:
          return state;
      }
  }
  
  export default pointsReducer