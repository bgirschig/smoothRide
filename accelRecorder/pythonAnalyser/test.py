import matplotlib.pyplot as plt
import matplotlib
import data

dataset = data.migros2
sampleSize = 50
sensitivity = 0.5
triggerLag = 200
nextAllow = 0

prevValues = []
mean = 0
meanPlot = []
signal = []

for i in xrange(0,dataset.size):
	value = dataset[i];
	if len(prevValues)<sampleSize:
		prevValues.append(value)
	else:
		mean = sum(prevValues)/len(prevValues)
		meanPlot.append(mean/sensitivity)

		if(		prevValues[sampleSize-2]>prevValues[sampleSize-1]
			and prevValues[sampleSize-2]>prevValues[sampleSize-3]
			and prevValues[sampleSize-1]*sensitivity>mean
			and i>=nextAllow):
				signal.append(i-1)
				nextAllow = i+triggerLag
		prevValues.append(value)
		prevValues.pop(0)

plt.plot(dataset)
plt.plot(meanPlot)
plt.plot(signal, dataset[signal], 'ro')

print("result: ");
print(len(signal))

plt.show();

