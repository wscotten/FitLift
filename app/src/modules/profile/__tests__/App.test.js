import { mapStateToProps } from '../App';

describe('mapStateToProps tests', () => {
  it('should work with intial state', () => {
    expect(mapStateToProps({
      db: {
        newExercises: [],
      },
      record: {
        isLoading: false,
      },
    })).toEqual({
      newExercises: [],
      record: {
        isLoading: false,
      },
    });
  });
});
