
filename = 'Misaki_home.atlas'

with open(filename, 'r') as f, open('Misaki_home@2x.atlas', 'w') as out:
    for line in f:
        try:
            a, b = line.split(':')
            
            x,y = b.split(',')
            x,y = x.strip(), y.strip()
            if x.isdecimal() and y.isdecimal():
                x = int(x) * 2
                y = int(y) * 2
                out.write(a + ':' + str(x) + ',' + str(y)+'\n')
            else:
                out.write(line)
        except ValueError:
            out.write(line)