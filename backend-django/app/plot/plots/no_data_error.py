class NoDataError(Exception):
    def __init__(self, gene, feature, dataset):
        self.gene = gene
        self.feature = feature
        self.dataset = dataset
    def __str__(self):
        return f"No data found for {self.feature} of {self.gene} in {self.dataset}"

class NoPairError(Exception):
    def __str__(self):
        return f"No suitable data."

class FeatureError(Exception): #异常feature
    def __init__(self, feature):
        self.feature = feature

    def __str__(self):
        return f"Invalid feature name: {self.feature}"

class NoBiomarkerError(Exception): #异常feature
    def __init__(self, gene):
        self.feature = gene

    def __str__(self):
        return f"No biomarker related to gene {self.feature} was found in our collection."

class NoEntityError(Exception):
    def __init__(self,gene):
        self.feature = gene
    def __str__(self):
        return f'No entities of gene {self.feature} found, comparison function not available'
