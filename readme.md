# issue:

we have nested directive:
1. lazyRepeat which return i interval new elements
2. repeat directive then rendering this elements
3. whenNearScreen should update element according to screen visibility

whenNearScreen -> this.setValue() is called but nothing happends. If i remove lazyRepeat, example will works fine.

# how to start:
1. `yarn`
2. `yarn dev`